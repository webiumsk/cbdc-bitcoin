/**
 * Merge data/incoming/*.json patches + data/enrichment.json into public/cbdc-data.json.
 * Skips writing if country payload is unchanged (avoids noisy CI / lastUpdated-only churn).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicPath = join(root, 'public/cbdc-data.json')
const incomingDir = join(root, 'data/incoming')
const enrichmentPath = join(root, 'data/enrichment.json')

const ALLOWED_STATUS = new Set(['launched', 'pilot', 'development', 'research', 'cancelled'])

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function fingerprintCountries(countries) {
  const sorted = [...countries].sort((a, b) => a.id.localeCompare(b.id))
  return JSON.stringify(sorted)
}

function mergeCountry(base, patch) {
  return { ...base, ...patch }
}

function applyIncomingFiles(countriesById, order) {
  if (!existsSync(incomingDir)) return
  const files = readdirSync(incomingDir).filter((f) => f.endsWith('.json')).sort()
  for (const file of files) {
    const data = loadJson(join(incomingDir, file))
    if (!data.countries || !Array.isArray(data.countries)) {
      console.warn(`Skipping ${file}: missing "countries" array`)
      continue
    }
    for (const patch of data.countries) {
      if (!patch.id) {
        console.warn(`Skipping entry in ${file}: missing id`)
        continue
      }
      const existing = countriesById.get(patch.id)
      if (existing) {
        countriesById.set(patch.id, mergeCountry(existing, patch))
      } else {
        order.push(patch.id)
        countriesById.set(patch.id, { ...patch })
      }
    }
  }
}

function applyEnrichment(countriesById) {
  if (!existsSync(enrichmentPath)) return
  const enr = loadJson(enrichmentPath)
  if (typeof enr !== 'object' || enr === null) return

  for (const [id, fields] of Object.entries(enr)) {
    if (id.startsWith('_')) continue
    if (fields === null || typeof fields !== 'object' || Array.isArray(fields)) continue
    const existing = countriesById.get(id)
    if (existing) {
      countriesById.set(id, mergeCountry(existing, fields))
    } else {
      console.warn(`Enrichment references unknown country id: ${id}`)
    }
  }
}

function validateCountry(c, i) {
  const label = c.id || `#${i}`
  const req = ['id', 'name', 'flag', 'cbdcName', 'status', 'population', 'lat', 'lng', 'riskLevel', 'description']
  for (const k of req) {
    if (c[k] === undefined || c[k] === '') {
      throw new Error(`Country ${label}: missing required field "${k}"`)
    }
  }
  if (!ALLOWED_STATUS.has(c.status)) {
    throw new Error(`Country ${label}: invalid status "${c.status}"`)
  }
  if (typeof c.lat !== 'number' || typeof c.lng !== 'number') {
    throw new Error(`Country ${label}: lat/lng must be numbers`)
  }
  if (typeof c.population !== 'number') {
    throw new Error(`Country ${label}: population must be a number`)
  }
  if (!Array.isArray(c.features) || !Array.isArray(c.threats)) {
    throw new Error(`Country ${label}: features and threats must be arrays`)
  }
  if (c.launchedYear !== undefined && c.launchedYear !== null && typeof c.launchedYear !== 'number') {
    throw new Error(`Country ${label}: launchedYear must be number or null`)
  }
  if (c.url !== undefined && c.url !== null && typeof c.url !== 'string') {
    throw new Error(`Country ${label}: url must be string or null`)
  }
}

function main() {
  if (!existsSync(publicPath)) {
    console.error(`Missing ${publicPath}`)
    process.exit(1)
  }

  const base = loadJson(publicPath)
  if (!base.countries || !Array.isArray(base.countries)) {
    console.error('Base file must contain a "countries" array')
    process.exit(1)
  }

  const order = base.countries.map((c) => c.id)
  const countriesById = new Map(base.countries.map((c) => [c.id, { ...c }]))

  applyIncomingFiles(countriesById, order)
  applyEnrichment(countriesById)

  const countries = order.map((id) => countriesById.get(id)).filter(Boolean)
  countries.forEach(validateCountry)

  const nextFp = fingerprintCountries(countries)
  const prevFp = fingerprintCountries(base.countries)

  if (nextFp === prevFp) {
    console.log('No country data changes; leaving public/cbdc-data.json untouched.')
    process.exit(0)
  }

  const d = new Date()
  const lastUpdated = `${String(d.getUTCDate()).padStart(2, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${d.getUTCFullYear()}`
  const out = { lastUpdated, countries }
  writeFileSync(publicPath, `${JSON.stringify(out, null, 2)}\n`)
  console.log(`Updated ${publicPath} (${countries.length} countries, lastUpdated=${lastUpdated})`)
}

try {
  main()
} catch (e) {
  console.error(e.message || e)
  process.exit(1)
}
