import type { GoogleBookResult } from '../types'

export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  if (!query.trim()) return []

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
  const keyParam = apiKey ? `&key=${apiKey}` : ''
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20${keyParam}`,
  )
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    if (res.status === 429) {
      throw new Error(
        apiKey
          ? 'Google Books rate limit hit — try again in a moment.'
          : 'Google Books needs an API key to work reliably. See README for setup.',
      )
    }
    throw new Error(body?.error?.message ?? 'Google Books search failed')
  }

  const data = await res.json()

  return (data.items ?? []).map((item: any) => ({
    googleBooksId: item.id,
    title: item.volumeInfo?.title ?? 'Untitled',
    authors: item.volumeInfo?.authors ?? [],
    thumbnail: item.volumeInfo?.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
    description: item.volumeInfo?.description ?? '',
    pageCount: item.volumeInfo?.pageCount ?? null,
    categories: item.volumeInfo?.categories ?? [],
  }))
}

function normalizeForMatch(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** True if `resultTitle` looks like the same book as `queryTitle` (allows subtitle variants). */
function titlesMatch(resultTitle: string, queryTitle: string) {
  const a = normalizeForMatch(resultTitle)
  const b = normalizeForMatch(queryTitle)
  // Guard against a title that strips down to nothing (e.g. a non-Latin-script
  // edition) — an empty string is a "prefix" of everything in JS, so without
  // this check such a title would incorrectly match every query.
  if (!a || !b) return false
  return a === b || a.startsWith(b) || b.startsWith(a)
}

export interface BookEnrichment {
  cover_url: string | null
  genre: string | null
  page_count: number | null
  google_books_id: string | null
}

const EMPTY_ENRICHMENT: BookEnrichment = {
  cover_url: null,
  genre: null,
  page_count: null,
  google_books_id: null,
}

/** Best-effort cover/genre/page-count lookup for a book we only have title/author for (quick TBR add, CSV backfill). */
export async function enrichBookFromTitleAuthor(
  title: string,
  author?: string | null,
): Promise<BookEnrichment> {
  // Plain text (not intitle:/inauthor: field restrictors) tolerates typos in
  // scraped data much better — a misspelled author name can otherwise starve
  // the field-restricted query down to a handful of low-quality matches.
  const query = author ? `${title} ${author}` : title
  try {
    const results = await searchGoogleBooks(query)
    // The top hit is sometimes a DVD/audio edition with no cover art, so scan
    // for the first result that actually has one — but only accept a match
    // whose title agrees with what we searched for. A generic-word title
    // (e.g. "Marrow") can otherwise pull in metadata from a completely
    // unrelated, more "popular" book that just happens to rank higher.
    const match =
      results.find((r) => r.thumbnail && titlesMatch(r.title, title)) ??
      results.find((r) => titlesMatch(r.title, title))
    if (!match) return EMPTY_ENRICHMENT
    return {
      cover_url: match.thumbnail,
      genre: match.categories[0] ?? null,
      page_count: match.pageCount,
      google_books_id: match.googleBooksId,
    }
  } catch {
    return EMPTY_ENRICHMENT
  }
}

/** Cover-only convenience wrapper over enrichBookFromTitleAuthor, kept for existing callers. */
export async function findCoverForBook(
  title: string,
  author?: string | null,
): Promise<string | null> {
  return (await enrichBookFromTitleAuthor(title, author)).cover_url
}
