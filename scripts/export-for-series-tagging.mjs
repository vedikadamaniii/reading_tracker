// Exports all books to a CSV with blank (or existing) series_name/series_order
// columns for you to fill in in a spreadsheet app, then apply back with
// apply-series-tags.mjs. Re-running this after partial tagging preserves
// whatever you've already filled in on Supabase.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/export-for-series-tagging.mjs [output-path]

import { writeFileSync } from 'node:fs'
import { requireSupabaseEnv } from './csv-utils.mjs'

const outPath = process.argv[2] ?? `${process.env.HOME}/Downloads/reading-tracker-series-tagging.csv`
const { SUPABASE_URL, SUPABASE_ANON_KEY } = requireSupabaseEnv(false)

const res = await fetch(
  `${SUPABASE_URL}/rest/v1/books?select=id,title,author,status,series_name,series_order&order=author,title`,
  {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  },
)
if (!res.ok) {
  console.error('Failed to fetch books:', res.status, await res.text())
  process.exit(1)
}
const books = await res.json()

function csvField(value) {
  const s = value == null ? '' : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const header = 'id,title,author,status,series_name,series_order'
const rows = books.map((b) =>
  [b.id, b.title, b.author, b.status, b.series_name, b.series_order].map(csvField).join(','),
)

writeFileSync(outPath, [header, ...rows].join('\n') + '\n', 'utf-8')
console.log(`Wrote ${books.length} books to ${outPath}`)
console.log('Fill in series_name (and series_order, e.g. 1, 2, 3) for books that are part of a series.')
console.log('Leave both blank for standalone books. Then run apply-series-tags.mjs on the filled file.')
