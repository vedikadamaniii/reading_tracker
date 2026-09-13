// Applies the reviewed CSV from propose-title-renames.mjs: for every row
// with apply=TRUE, updates that book's title in Supabase.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/apply-title-renames.mjs <path-to-csv> [--dry-run]

import { readFileSync } from 'node:fs'
import { parseCsvLine, requireSupabaseEnv } from './csv-utils.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const csvPath = args.find((a) => !a.startsWith('--'))
if (!csvPath) {
  console.error('Usage: node scripts/apply-title-renames.mjs <path-to-csv> [--dry-run]')
  process.exit(1)
}

const { SUPABASE_URL, SUPABASE_ANON_KEY } = requireSupabaseEnv(dryRun)

const raw = readFileSync(csvPath, 'utf-8')
const lines = raw.split(/\r?\n/).filter((l) => l.length > 0)
const header = parseCsvLine(lines[0])
const idx = {
  id: header.indexOf('id'),
  old_title: header.indexOf('old_title'),
  new_title: header.indexOf('new_title'),
  apply: header.indexOf('apply'),
}

const toApply = []
for (const line of lines.slice(1)) {
  const fields = parseCsvLine(line)
  const apply = fields[idx.apply]?.trim().toUpperCase() === 'TRUE'
  if (!apply) continue
  toApply.push({
    id: fields[idx.id]?.trim(),
    old_title: fields[idx.old_title]?.trim(),
    new_title: fields[idx.new_title]?.trim(),
  })
}

console.log(`${toApply.length} renames to apply.${dryRun ? ' (dry run)' : ''}`)

for (const r of toApply) {
  console.log(`  "${r.old_title}" -> "${r.new_title}"`)
  if (dryRun) continue
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${r.id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ title: r.new_title }),
  })
  if (!res.ok) {
    console.error(`    failed:`, res.status, await res.text())
  }
}

if (!dryRun) console.log(`\nApplied ${toApply.length} renames.`)
