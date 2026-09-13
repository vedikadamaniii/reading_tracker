// Reads the CSV produced by export-for-series-tagging.mjs (after you've
// filled in series_name/series_order) and patches those two columns back
// onto the matching books in Supabase, matched by id.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/apply-series-tags.mjs <path-to-csv> [--dry-run]

import { readFileSync } from 'node:fs'
import { parseCsvLine, requireSupabaseEnv } from './csv-utils.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const csvPath = args.find((a) => !a.startsWith('--'))
if (!csvPath) {
  console.error('Usage: node scripts/apply-series-tags.mjs <path-to-csv> [--dry-run]')
  process.exit(1)
}

const { SUPABASE_URL, SUPABASE_ANON_KEY } = requireSupabaseEnv(dryRun)

const raw = readFileSync(csvPath, 'utf-8')
const lines = raw.split(/\r?\n/).filter((l) => l.length > 0)
const header = parseCsvLine(lines[0])
const idx = {
  id: header.indexOf('id'),
  title: header.indexOf('title'),
  series_name: header.indexOf('series_name'),
  series_order: header.indexOf('series_order'),
}

const updates = []
for (const line of lines.slice(1)) {
  const fields = parseCsvLine(line)
  const id = fields[idx.id]?.trim()
  const seriesName = fields[idx.series_name]?.trim()
  const seriesOrderRaw = fields[idx.series_order]?.trim()
  if (!id || !seriesName) continue

  updates.push({
    id,
    title: fields[idx.title]?.trim(),
    series_name: seriesName,
    series_order: seriesOrderRaw ? Number(seriesOrderRaw) : null,
  })
}

console.log(`${updates.length} books have a series_name filled in.`)

if (dryRun) {
  console.log('\n--dry-run: sample updates, nothing sent to Supabase --')
  console.log(updates.slice(0, 10))
  process.exit(0)
}

for (const u of updates) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${u.id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ series_name: u.series_name, series_order: u.series_order }),
  })
  if (!res.ok) {
    console.error(`Failed to update "${u.title}":`, res.status, await res.text())
  }
}

console.log(`Applied series tags to ${updates.length} books.`)
