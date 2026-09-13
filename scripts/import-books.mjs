// One-time import: reads the exported CSV from the old spreadsheet tracker
// and inserts rows into Supabase, mapped onto the `books` schema.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/import-books.mjs <path-to-csv>

import { readFileSync } from 'node:fs'
import { insertBooks, parseCsvLine, requireSupabaseEnv, roundToHalf, toIsoDate } from './csv-utils.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const csvPath = args.find((a) => !a.startsWith('--'))
if (!csvPath) {
  console.error('Usage: node scripts/import-books.mjs <path-to-csv> [--dry-run]')
  process.exit(1)
}

const { SUPABASE_URL, SUPABASE_ANON_KEY } = requireSupabaseEnv(dryRun)

const raw = readFileSync(csvPath, 'utf-8')
const lines = raw.split(/\r?\n/).filter((l) => l.length > 0)
const header = parseCsvLine(lines[0])
const col = (name) => header.indexOf(name)

const idx = {
  title: col('Title'),
  author: col('Author'),
  start: col('Start Date'),
  end: col('End Date'),
  genre: col('Genre'),
  rating: col('Rating (1-5)'),
}

const books = []
for (const line of lines.slice(1)) {
  const fields = parseCsvLine(line)
  const title = fields[idx.title]?.trim()
  if (!title) continue

  const author = fields[idx.author]?.trim() || null
  const genre = fields[idx.genre]?.trim() || null
  const dateStarted = toIsoDate(fields[idx.start] ?? '')
  const dateFinished = toIsoDate(fields[idx.end] ?? '')
  const ratingRaw = fields[idx.rating]?.trim()
  const rating = ratingRaw ? roundToHalf(parseFloat(ratingRaw)) : null

  let status
  if (rating != null) {
    status = 'finished'
  } else if (dateStarted) {
    status = 'reading'
  } else {
    status = 'tbr'
  }

  books.push({
    title,
    author,
    genre,
    status,
    rating,
    date_started: dateStarted,
    date_finished: status === 'finished' ? dateFinished : null,
  })
}

console.log(`Parsed ${books.length} books:`)
console.log(`  finished: ${books.filter((b) => b.status === 'finished').length}`)
console.log(`  reading:  ${books.filter((b) => b.status === 'reading').length}`)
console.log(`  tbr:      ${books.filter((b) => b.status === 'tbr').length}`)

if (dryRun) {
  console.log('\n--dry-run: sample rows, no data was sent to Supabase --')
  console.log(books.slice(0, 3))
  console.log('...')
  console.log(books.slice(-3))
  process.exit(0)
}

await insertBooks(SUPABASE_URL, SUPABASE_ANON_KEY, books)
console.log(`Inserted ${books.length} books into Supabase.`)
