// Builds src/data/library.json from the spreadsheet exports, so the site can
// run without a database. Applies the same status rules as import-books.mjs
// and import-tbr.mjs, then layers on series tags and reviewed title renames.
//
// Earlier Supabase-era work (series tags, renames) is keyed by book id; the
// optional id export (from export-for-series-tagging.mjs) maps those ids back
// to titles so they still apply.
//
// Covers and page counts are looked up on Google Books once and reused from
// the existing library.json on later runs.
//
// Usage:
//   VITE_GOOGLE_BOOKS_API_KEY=... node scripts/build-static-library.mjs \
//     <tracker.csv> <tbr.csv> [id-export.csv] [title-renames.csv]
//
// After the first run, only the two sheet exports are needed: each book
// remembers which sheet row it came from (source_key), so its id, series
// tags, renamed title, cover and page count carry over to the next build.

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { normalizeTitle, parseCsvLine, roundToHalf, toIsoDate } from './csv-utils.mjs'
import { seriesTags } from './series-tags-data.mjs'

const OUT_PATH = new URL('../src/data/library.json', import.meta.url)
const [trackerPath, tbrPath, idExportPath, renamesPath] = process.argv.slice(2)
if (!trackerPath || !tbrPath) {
  console.error(
    'Usage: node scripts/build-static-library.mjs <tracker.csv> <tbr.csv> [id-export.csv] [title-renames.csv]',
  )
  process.exit(1)
}
const GOOGLE_BOOKS_API_KEY = process.env.VITE_GOOGLE_BOOKS_API_KEY

const readCsv = (path) =>
  readFileSync(path, 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.length > 0)
    .map(parseCsvLine)

const clean = (s) => s?.replace(/\s+/g, ' ').trim() || null
const keyOf = (title) => normalizeTitle(title)

// --- Main tracker (same rules as import-books.mjs) ---
const trackerRows = readCsv(trackerPath)
const th = trackerRows[0]
const tcol = (name) => th.indexOf(name)
const books = []
for (const f of trackerRows.slice(1)) {
  const title = clean(f[tcol('Title')])
  if (!title) continue
  const ratingRaw = clean(f[tcol('Rating (1-5)')])
  const rating = ratingRaw ? roundToHalf(parseFloat(ratingRaw)) : null
  const dateStarted = toIsoDate(f[tcol('Start Date')] ?? '')
  const status = rating != null ? 'finished' : dateStarted ? 'reading' : 'tbr'
  books.push({
    title,
    author: clean(f[tcol('Author')]),
    genre: clean(f[tcol('Genre')]),
    status,
    rating,
    date_started: dateStarted,
    date_finished: status === 'finished' ? toIsoDate(f[tcol('End Date')] ?? '') : null,
  })
}

// --- TBR checklist (same rules as import-tbr.mjs: only titles not already tracked) ---
const tracked = new Set(books.map((b) => keyOf(b.title)))
const tbrRows = readCsv(tbrPath)
const headerIndex = tbrRows.findIndex((f) => f[0]?.trim() === 'Read')
const bh = tbrRows[headerIndex]
for (const f of tbrRows.slice(headerIndex + 1)) {
  const title = clean(f[bh.indexOf('Book')])
  if (!title || tracked.has(keyOf(title))) continue
  tracked.add(keyOf(title))
  const read = f[bh.indexOf('Read')]?.trim().toUpperCase() === 'TRUE'
  books.push({
    title,
    author: clean(f[bh.indexOf('Author')]),
    genre: clean(f[bh.indexOf('Genre')]),
    status: read ? 'finished' : 'tbr',
    rating: null,
    date_started: null,
    date_finished: null,
  })
}

// --- Reattach Supabase-era ids so id-keyed series tags and renames apply ---
const idByKey = new Map()
if (idExportPath) {
  const rows = readCsv(idExportPath)
  const h = rows[0]
  for (const f of rows.slice(1)) {
    const key = `${keyOf(f[h.indexOf('title')])}|${keyOf(f[h.indexOf('author')] ?? '')}`
    idByKey.set(key, f[h.indexOf('id')])
  }
}
const fallbackId = (b) => {
  const hex = createHash('sha1').update(`${b.title}|${b.author ?? ''}`).digest('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

const renames = new Map()
if (renamesPath) {
  const rows = readCsv(renamesPath)
  const h = rows[0]
  for (const f of rows.slice(1)) {
    if (f[h.indexOf('apply')]?.trim().toUpperCase() === 'TRUE') {
      renames.set(f[h.indexOf('id')], clean(f[h.indexOf('new_title')]))
    }
  }
}
const seriesById = new Map(seriesTags.map((t) => [t.id, t]))

const previous = existsSync(OUT_PATH) ? JSON.parse(readFileSync(OUT_PATH, 'utf-8')) : []
const previousByKey = new Map(previous.map((b) => [b.source_key, b]))

// --- Google Books enrichment (cover + page count), reused across runs ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const forMatch = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
function titlesMatch(resultTitle, queryTitle) {
  const a = forMatch(resultTitle)
  const b = forMatch(queryTitle)
  if (!a || !b) return false
  return a === b || a.startsWith(b) || b.startsWith(a)
}
async function lookup(title, author) {
  const q = encodeURIComponent(author ? `${title} ${author}` : title)
  const keyParam = GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ''
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5${keyParam}`)
  if (!res.ok) {
    console.warn(`  lookup failed (${res.status}) for "${title}"`)
    return null
  }
  const items = ((await res.json()).items ?? []).filter((i) =>
    titlesMatch(i.volumeInfo?.title ?? '', title),
  )
  const withCover = items.find((i) => i.volumeInfo?.imageLinks?.thumbnail)
  const withPages = items.find((i) => i.volumeInfo?.pageCount)
  return {
    cover_url: withCover?.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://') ?? null,
    google_books_id: withCover?.id ?? withPages?.id ?? null,
    page_count: withPages?.volumeInfo.pageCount ?? null,
  }
}

const base = Date.parse('2024-01-01T00:00:00Z')
const out = []
let looked = 0
for (const [i, b] of books.entries()) {
  const source_key = `${keyOf(b.title)}|${keyOf(b.author ?? '')}`
  const prev = previousByKey.get(source_key)
  const id = idByKey.get(source_key) ?? prev?.id ?? fallbackId(b)
  const series = seriesById.get(id) ?? prev
  const book = {
    id,
    source_key,
    ...b,
    title: renames.get(id) ?? prev?.title ?? b.title,
    cover_url: prev?.cover_url ?? null,
    google_books_id: prev?.google_books_id ?? null,
    page_count: prev?.page_count ?? null,
    series_name: series?.series_name ?? null,
    series_order: series?.series_order ?? null,
    notes: null,
    // Later sheet rows are newer; the app lists newest first.
    created_at: new Date(base + i * 60_000).toISOString(),
  }
  if (!prev || (!prev.cover_url && !prev.page_count)) {
    const found = await lookup(book.title, book.author)
    looked++
    if (found) Object.assign(book, found)
    await sleep(150)
  }
  out.push(book)
}

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n')
const count = (s) => out.filter((b) => b.status === s).length
console.log(`Wrote ${out.length} books (${count('finished')} finished, ${count('reading')} reading, ${count('tbr')} tbr)`)
const knownIds = new Set(idByKey.values())
console.log(`  matched to Supabase-era ids: ${out.filter((b) => knownIds.has(b.id)).length}`)
console.log(`  series tagged: ${out.filter((b) => b.series_name).length}, renamed: ${out.filter((b) => renames.has(b.id)).length}`)
console.log(`  Google Books lookups: ${looked}; with cover: ${out.filter((b) => b.cover_url).length}, with pages: ${out.filter((b) => b.page_count).length}`)
