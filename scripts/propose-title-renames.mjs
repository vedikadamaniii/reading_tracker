// Looks up each book on Google Books (by current title + author) and
// proposes renaming to the canonical title Google has on file — useful for
// cleaning up titles that were typed by hand (typos, inconsistent casing,
// stray trailing spaces).
//
// Writes a CSV for review rather than applying anything directly: skim it,
// delete/edit any row that looks wrong (a common failure is landing on the
// wrong edition or an unrelated adaptation), then run apply-title-renames.mjs.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... VITE_GOOGLE_BOOKS_API_KEY=... \
//     node scripts/propose-title-renames.mjs [output-path]

import { writeFileSync } from 'node:fs'
import { requireSupabaseEnv } from './csv-utils.mjs'

const outPath = process.argv[2] ?? `${process.env.HOME}/Downloads/reading-tracker-title-renames.csv`
const { SUPABASE_URL, SUPABASE_ANON_KEY } = requireSupabaseEnv(false)
const GOOGLE_BOOKS_API_KEY = process.env.VITE_GOOGLE_BOOKS_API_KEY
if (!GOOGLE_BOOKS_API_KEY) {
  console.error('Set VITE_GOOGLE_BOOKS_API_KEY in the environment first.')
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

async function findCanonicalTitle(title, author) {
  const query = author ? `${title} ${author}` : title
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&key=${GOOGLE_BOOKS_API_KEY}`,
  )
  if (!res.ok) return null
  const data = await res.json()
  for (const item of data.items ?? []) {
    const vi = item.volumeInfo ?? {}
    const candidate = vi.title
    if (!candidate) continue
    // Skip obvious non-book editions (DVDs, play scripts, study guides) that
    // would otherwise "correct" a real book's title into the wrong thing.
    if (/\[dvd\]|play script|study guide/i.test(candidate)) continue
    if (!vi.imageLinks?.thumbnail) continue
    return candidate
  }
  return null
}

const res = await fetch(`${SUPABASE_URL}/rest/v1/books?select=id,title,author&order=author,title`, {
  headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
})
if (!res.ok) {
  console.error('Failed to fetch books:', res.status, await res.text())
  process.exit(1)
}
const books = await res.json()

function csvField(value) {
  const s = value == null ? '' : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const rows = []
let unchanged = 0
let noMatch = 0

for (const book of books) {
  const canonical = await findCanonicalTitle(book.title, book.author)
  if (!canonical) {
    noMatch++
  } else if (normalize(canonical) === normalize(book.title)) {
    unchanged++
  } else {
    rows.push({ id: book.id, author: book.author, old_title: book.title, new_title: canonical, apply: 'TRUE' })
    console.log(`  "${book.title}" -> "${canonical}"`)
  }
  await sleep(120)
}

const header = 'id,author,old_title,new_title,apply'
const csvRows = rows.map((r) =>
  [r.id, r.author, r.old_title, r.new_title, r.apply].map(csvField).join(','),
)
writeFileSync(outPath, [header, ...csvRows].join('\n') + '\n', 'utf-8')

console.log(`\n${rows.length} proposed renames, ${unchanged} already match, ${noMatch} had no confident match.`)
console.log(`Wrote proposals to ${outPath}`)
console.log('Review it — set apply to FALSE on any row that looks wrong — then run apply-title-renames.mjs.')
