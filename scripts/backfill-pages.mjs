// One-time backfill: finds books in Supabase with no page_count and looks
// one up via the Google Books API, using title + author as the search query.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... VITE_GOOGLE_BOOKS_API_KEY=... \
//     node scripts/backfill-pages.mjs [--dry-run]

import { requireSupabaseEnv } from './csv-utils.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

const { SUPABASE_URL, SUPABASE_ANON_KEY } = requireSupabaseEnv(false)
const GOOGLE_BOOKS_API_KEY = process.env.VITE_GOOGLE_BOOKS_API_KEY
if (!GOOGLE_BOOKS_API_KEY) {
  console.error('Set VITE_GOOGLE_BOOKS_API_KEY in the environment first.')
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function normalizeForMatch(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function titlesMatch(resultTitle, queryTitle) {
  const a = normalizeForMatch(resultTitle)
  const b = normalizeForMatch(queryTitle)
  // Guard against a title that strips down to nothing (e.g. a non-Latin-script
  // edition) — an empty string is a "prefix" of everything in JS, so without
  // this check such a title would incorrectly match every query.
  if (!a || !b) return false
  return a === b || a.startsWith(b) || b.startsWith(a)
}

async function findPageCount(title, author) {
  const query = author ? `${title} ${author}` : title
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=15&key=${GOOGLE_BOOKS_API_KEY}`,
  )
  if (!res.ok) {
    console.warn(`  lookup failed (${res.status}) for "${title}"`)
    return null
  }
  const data = await res.json()
  // Same title-match guard as backfill-covers.mjs — a generic-word title
  // (e.g. "Marrow") can otherwise pull a page count from an unrelated book.
  for (const item of data.items ?? []) {
    const pageCount = item.volumeInfo?.pageCount
    if (pageCount && titlesMatch(item.volumeInfo?.title ?? '', title)) {
      return pageCount
    }
  }
  return null
}

async function updatePageCount(id, page_count) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ page_count }),
  })
  if (!res.ok) {
    console.error(`  failed to save page count for ${id}:`, res.status, await res.text())
  }
}

const res = await fetch(
  `${SUPABASE_URL}/rest/v1/books?page_count=is.null&select=id,title,author`,
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

console.log(`${books.length} books missing a page count.${dryRun ? ' (dry run)' : ''}`)

let found = 0
let missed = 0

for (const book of books) {
  const pageCount = await findPageCount(book.title, book.author)
  if (pageCount) {
    found++
    console.log(`  ✓ ${book.title} (${pageCount} pages)`)
    if (!dryRun) await updatePageCount(book.id, pageCount)
  } else {
    missed++
    console.log(`  ✗ ${book.title} (no page count found)`)
  }
  await sleep(120)
}

console.log(`\nDone. Found page counts for ${found}, no match for ${missed}.`)
