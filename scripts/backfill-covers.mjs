// One-time backfill: finds books in Supabase with no cover_url and looks one
// up via the Google Books API, using title + author as the search query.
//
// Usage:
//   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... VITE_GOOGLE_BOOKS_API_KEY=... \
//     node scripts/backfill-covers.mjs [--dry-run]

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

async function findCover(title, author) {
  // Plain text (not intitle:/inauthor:) tolerates typos in scraped data much
  // better — see src/lib/googleBooks.ts findCoverForBook for the same fix.
  const query = author ? `${title} ${author}` : title
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&key=${GOOGLE_BOOKS_API_KEY}`,
  )
  if (!res.ok) {
    console.warn(`  lookup failed (${res.status}) for "${title}"`)
    return null
  }
  const data = await res.json()
  // The top hit is sometimes a DVD/audio edition with no cover art, so scan
  // a few results for the first one that actually has a thumbnail — but only
  // accept a title that agrees with what we searched for, since a generic
  // word (e.g. "Marrow") can otherwise pull in an unrelated book's cover.
  for (const item of data.items ?? []) {
    const thumbnail = item.volumeInfo?.imageLinks?.thumbnail
    if (thumbnail && titlesMatch(item.volumeInfo?.title ?? '', title)) {
      return thumbnail.replace('http://', 'https://')
    }
  }
  return null
}

async function updateCover(id, cover_url) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ cover_url }),
  })
  if (!res.ok) {
    console.error(`  failed to save cover for ${id}:`, res.status, await res.text())
  }
}

const res = await fetch(
  `${SUPABASE_URL}/rest/v1/books?cover_url=is.null&select=id,title,author`,
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

console.log(`${books.length} books missing a cover.${dryRun ? ' (dry run)' : ''}`)

let found = 0
let missed = 0

for (const book of books) {
  const cover = await findCover(book.title, book.author)
  if (cover) {
    found++
    console.log(`  ✓ ${book.title}`)
    if (!dryRun) await updateCover(book.id, cover)
  } else {
    missed++
    console.log(`  ✗ ${book.title} (no cover found)`)
  }
  // Be polite to the API — well under the free-tier rate limit either way.
  await sleep(120)
}

console.log(`\nDone. Found covers for ${found}, no match for ${missed}.`)
