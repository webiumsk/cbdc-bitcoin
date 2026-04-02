/**
 * Skenuje zdroje z data/research-sources.json (rovnaký zoznam ako vo Footeri),
 * sťahuje HTML, extrahuje čitateľný text a porovnáva verejné metriky s public/cbdc-data.json.
 *
 * Nevie automaticky doplniť všetky krajiny: trackery sú často SPA (Flourish, Next.js)
 * bez otvoreného JSON v HTML. Výstup: report + súbor pre LLM (copy-paste) na návrh patchov.
 *
 * Spustenie: npm run research:sources
 */
import * as cheerio from 'cheerio'
import dotenv from 'dotenv'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
dotenv.config({ path: join(root, '.env'), quiet: true })

const OUT_DIR = join(root, 'data/research-output')
const SOURCES_PATH = join(root, 'data/research-sources.json')
const DATA_PATH = join(root, 'public/cbdc-data.json')

const DELAY_MS = Number(process.env.RESEARCH_FETCH_DELAY_MS || 900)
const TIMEOUT_MS = Number(process.env.RESEARCH_FETCH_TIMEOUT_MS || 28000)

const UA =
  process.env.RESEARCH_USER_AGENT ||
  'cbdc.icu-research/1.0 (+https://cbdc.icu; data pipeline)'

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function datasetStats(countries) {
  const byStatus = {}
  for (const c of countries) {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1
  }
  return {
    total: countries.length,
    byStatus,
    idsSample: countries.slice(0, 15).map((c) => `${c.id}:${c.status}`),
    allIds: countries.map((c) => c.id).sort()
  }
}

function normalizeBodyText(html) {
  const $ = cheerio.load(html)
  $('script, style, noscript, svg').remove()
  return $('body').text().replace(/\s+/g, ' ').trim()
}

function extractAtlanticMetrics(text) {
  const m = {}
  const re = (pattern) => {
    const x = text.match(pattern)
    return x ? parseInt(x[1], 10) : null
  }
  m.countriesExploring = re(/(\d+)\s+countries(?:\s+&\s+currency unions)?/i)
  m.advancedPhase = re(/(\d+)\s+countries\s+are\s+in\s+the\s+advanced\s+phase/i)
  m.pilotProjects = re(/(\d+)\s+CBDC\s+pilot/i)
  m.retailLaunched = re(/(\d+)\s+countries\s+have\s+fully\s+launched/i)
  m.wholesaleProjects = re(/(\d+)\s+of\s+them/i)
  const lm = text.match(/Last updated:\s*([A-Za-z]+\s+\d{4})/i)
  m.lastUpdatedMention = lm ? lm[1].trim() : null
  return m
}

function reconcileAtlantic(metrics, our) {
  const notes = []
  const warnings = []
  if (metrics.retailLaunched != null && metrics.retailLaunched !== our.byStatus.launched) {
    warnings.push(
      `Atlantic Council text spomína ${metrics.retailLaunched} plne spustených retail CBDC; v datasete je status "launched": ${our.byStatus.launched} (môže ísť o inú definíciu — wholesale, jurisdikcie atď.).`
    )
  }
  if (metrics.pilotProjects != null && Math.abs(metrics.pilotProjects - our.byStatus.pilot) > 15) {
    notes.push(
      `Počet pilotov na stránke (${metrics.pilotProjects}) sa výrazne líši od počtu "pilot" v JSON (${our.byStatus.pilot}) — skontroluj mapovanie kategórií.`
    )
  }
  if (metrics.countriesExploring != null && Math.abs(metrics.countriesExploring - our.total) > 40) {
    notes.push(
      `Stránka uvádza ~${metrics.countriesExploring} jurisdikcií v prieskume; tvoj JSON má ${our.total} záznamov — tracker môže počítať iné celky (menové únie, teritóriá).`
    )
  }
  return { metrics, warnings, notes }
}

async function fetchOne(src) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const started = Date.now()
  try {
    const res = await fetch(src.url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      signal: controller.signal,
      redirect: 'follow'
    })
    const html = await res.text()
    const text = normalizeBodyText(html).slice(0, 14000)
    clearTimeout(timer)
    return {
      id: src.id,
      label: src.label,
      url: src.url,
      category: src.category,
      role: src.role,
      httpStatus: res.status,
      ok: res.ok,
      ms: Date.now() - started,
      title: cheerio.load(html)('title').first().text().trim() || null,
      textLength: text.length,
      textPreview: text.slice(0, 2200),
      fullTextForMetrics: text
    }
  } catch (e) {
    clearTimeout(timer)
    return {
      id: src.id,
      label: src.label,
      url: src.url,
      category: src.category,
      role: src.role,
      ok: false,
      error: e.name === 'AbortError' ? 'timeout' : String(e.message || e),
      ms: Date.now() - started
    }
  }
}

function buildLlmContext(report, countries) {
  const lines = []
  lines.push('# CBDC.icu — kontext pre doplnenie / úpravu public/cbdc-data.json')
  lines.push('')
  lines.push('## Aktuálny súhrn datasetu (public/cbdc-data.json)')
  lines.push(JSON.stringify(report.ourDataset, null, 2))
  lines.push('')
  lines.push('## Mapovanie statusov v JSON')
  lines.push('Povolené hodnoty status: launched | pilot | development | research | cancelled')
  lines.push('')
  lines.push('## ID krajín v datasete (použi presne tieto slugy v patchoch)')
  lines.push(report.ourDataset.allIds.join(', '))
  lines.push('')
  lines.push('## Porovnanie s Atlantic Council (zo stránky)')
  lines.push(JSON.stringify(report.reconciliation?.atlanticCouncil || {}, null, 2))
  lines.push('')
  lines.push('## Úryvky zo zdrojov (pre faktické zmeny vždy over primárny zdroj centrálnej banky)')
  for (const s of report.sources) {
    if (!s.textPreview) continue
    lines.push(`### ${s.label}`)
    lines.push(`URL: ${s.url}`)
    lines.push(s.textPreview)
    lines.push('')
  }
  lines.push('## Inštrukcia pre asistenta')
  lines.push(
    'Navrhni JSON v tvare { "countries": [ { "id": "slug", "status": "...", "cbdcName": "..." } ] } ' +
      'iba pre položky, kde máš v úryvkoch silný dôkaz. Neprepisuj celý súbor. ' +
      'Použi len existujúce id z listu vyššie. Výstup ulož ako data/incoming/tracker.json a spusti npm run update:data.'
  )
  return lines.join('\n').slice(0, 95000)
}

function buildMarkdownSummary(report) {
  const r = report.reconciliation?.atlanticCouncil
  let body = `# Research scan — ${report.generatedAt}\n\n`
  body += `## Náš dataset\n\n- **Celkom krajín:** ${report.ourDataset.total}\n`
  body += `- **lastUpdated (JSON):** ${report.ourDataset.lastUpdated}\n`
  body += `- **Podľa statusu:** \`${JSON.stringify(report.ourDataset.byStatus)}\`\n\n`
  if (r?.warnings?.length) {
    body += `## Upozornenia (Atlantic Council vs JSON)\n\n`
    r.warnings.forEach((w) => {
      body += `- ${w}\n`
    })
    body += '\n'
  }
  if (r?.notes?.length) {
    body += `## Poznámky\n\n`
    r.notes.forEach((n) => {
      body += `- ${n}\n`
    })
    body += '\n'
  }
  body += `## Zdroje\n\n| Zdroj | HTTP | ms |\n| --- | --- | --- |\n`
  for (const s of report.sources) {
    body += `| ${s.label} | ${s.httpStatus ?? '—'} | ${s.ms ?? '—'} |\n`
  }
  body += `\nPodrobnosti: \`data/research-output/last-scan.json\`\n`
  body += `\nLLM kontext: \`data/research-output/context-for-llm.txt\`\n`
  return body
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const sources = loadJson(SOURCES_PATH)
  const data = loadJson(DATA_PATH)
  const our = datasetStats(data.countries)

  const ourDataset = {
    total: our.total,
    lastUpdated: data.lastUpdated,
    byStatus: our.byStatus,
    allIds: our.allIds
  }

  const results = []
  for (const src of sources) {
    process.stdout.write(`Fetching ${src.id} … `)
    const row = await fetchOne(src)
    results.push(row)
    console.log(row.ok === false && row.error ? `fail (${row.error})` : `${row.httpStatus} ${row.ms}ms`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }

  const atlantic = results.find((r) => r.id === 'atlantic-council-cbdc' && r.fullTextForMetrics)
  let reconciliation = { atlanticCouncil: null }
  if (atlantic?.fullTextForMetrics) {
    const metrics = extractAtlanticMetrics(atlantic.fullTextForMetrics)
    reconciliation.atlanticCouncil = reconcileAtlantic(metrics, our)
  }

  const report = {
    generatedAt: new Date().toISOString(),
    ourDataset,
    reconciliation,
    sources: results.map((r) => ({
      id: r.id,
      label: r.label,
      url: r.url,
      category: r.category,
      httpStatus: r.httpStatus,
      ok: r.ok,
      error: r.error,
      ms: r.ms,
      title: r.title,
      textPreview: r.textPreview
    }))
  }

  writeFileSync(join(OUT_DIR, 'last-scan.json'), `${JSON.stringify(report, null, 2)}\n`)
  writeFileSync(join(OUT_DIR, 'context-for-llm.txt'), buildLlmContext(report, data.countries))
  writeFileSync(join(OUT_DIR, 'RESEARCH-SUMMARY.md'), buildMarkdownSummary(report))

  console.log('\nWritten:')
  console.log(`  ${join(OUT_DIR, 'last-scan.json')}`)
  console.log(`  ${join(OUT_DIR, 'context-for-llm.txt')}`)
  console.log(`  ${join(OUT_DIR, 'RESEARCH-SUMMARY.md')}`)
  if (reconciliation.atlanticCouncil?.warnings?.length) {
    console.log('\nWarnings:')
    reconciliation.atlanticCouncil.warnings.forEach((w) => console.log(`  - ${w}`))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
