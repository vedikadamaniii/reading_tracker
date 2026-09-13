// One-time import: reads the exported "TBR" checklist CSV (Read/Book/Author/Genre,
// where Read=TRUE means already finished) and inserts only the books that
// aren't already in Supabase (this list heavily overlaps with the main
// tracker). New TRUE rows land straight in the library as 'finished'
// (no rating/dates available from this sheet); new FALSE rows land in 'tbr'.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/import-tbr.mjs <path-to-csv>

import { readFileSync } from 'node:fs'
import {
  fetchExistingTitles,
  insertBooks,
  normalizeTitle,
  parseCsvLine,
  requireSupabaseEnv,
} from './csv-utils.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const csvPath = args.find((a) => !a.startsWith('--'))
if (!csvPath) {
  console.error('Usage: node scripts/import-tbr.mjs <path-to-csv> [--dry-run]')
  process.exit(1)
}

// Unlike import-books.mjs, this script always needs Supabase (even in
// --dry-run) since accurate dedup counts require reading existing titles.
const { SUPABASE_URL, SUPABASE_ANON_KEY } = requireSupabaseEnv(false)

const raw = readFileSync(csvPath, 'utf-8')
const lines = raw.split(/\r?\n/).filter((l) => l.length > 0)

// The sheet has a title line and a blank line before the real header row.
const headerLineIndex = lines.findIndex((l) => parseCsvLine(l)[0]?.trim() === 'Read')
if (headerLineIndex === -1) {
  console.error('Could not find the "Read,Book,Author,Genre" header row in this CSV.')
  process.exit(1)
}
const header = parseCsvLine(lines[headerLineIndex])
const col = (name) => header.indexOf(name)
const idx = { read: col('Read'), title: col('Book'), author: col('Author'), genre: col('Genre') }

const existingTitles = await fetchExistingTitles(SUPABASE_URL, SUPABASE_ANON_KEY)

const newBooks = []
let skippedExisting = 0
let skippedBlank = 0

for (const line of lines.slice(headerLineIndex + 1)) {
  const fields = parseCsvLine(line)
  const title = fields[idx.title]?.trim()
  if (!title) {
    skippedBlank++
    continue
  }

  if (existingTitles.has(normalizeTitle(title))) {
    skippedExisting++
    continue
  }

  const author = fields[idx.author]?.trim() || null
  const genre = fields[idx.genre]?.trim() || null
  const read = fields[idx.read]?.trim().toUpperCase() === 'TRUE'

  newBooks.push({
    title,
    author,
    genre,
    status: read ? 'finished' : 'tbr',
    rating: null,
    date_started: null,
    date_finished: null,
  })
}

console.log(`Rows: ${lines.length - headerLineIndex - 1}`)
console.log(`  skipped (blank title):     ${skippedBlank}`)
console.log(`  skipped (already tracked): ${skippedExisting}`)
console.log(`  new to import:             ${newBooks.length}`)
console.log(`    -> finished: ${newBooks.filter((b) => b.status === 'finished').length}`)
console.log(`    -> tbr:      ${newBooks.filter((b) => b.status === 'tbr').length}`)

if (dryRun) {
  console.log('\n--dry-run: sample new rows, nothing sent to Supabase --')
  console.log(newBooks.slice(0, 10))
  process.exit(0)
}

if (newBooks.length > 0) {
  await insertBooks(SUPABASE_URL, SUPABASE_ANON_KEY, newBooks)
}
console.log(`Inserted ${newBooks.length} new books into Supabase.`)
