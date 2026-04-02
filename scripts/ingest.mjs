/**
 * Optional remote ingest: if CBDC_INGEST_URL is set, fetches JSON and writes data/incoming/tracker.json.
 * Expected shape: { countries: [ { id, ...partial fields }, ... ] } or any JSON you map in build.
 */
import dotenv from 'dotenv'
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
dotenv.config({ path: join(root, '.env'), quiet: true })

const url = (process.env.CBDC_INGEST_URL || '').trim()

if (!url) {
  console.log('CBDC_INGEST_URL not set; skipping remote ingest.')
  process.exit(0)
}

const res = await fetch(url, {
  headers: { 'User-Agent': 'cbdc-bitcoin-data-pipeline/1.0 (+https://cbdc.icu)' }
})
if (!res.ok) {
  console.error(`Ingest failed: HTTP ${res.status}`)
  process.exit(1)
}

let data
try {
  data = await res.json()
} catch {
  console.error('Ingest failed: response is not valid JSON')
  process.exit(1)
}

const incomingDir = join(root, 'data/incoming')
mkdirSync(incomingDir, { recursive: true })
const outPath = join(incomingDir, 'tracker.json')
writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`)
console.log(`Wrote ${outPath}`)
