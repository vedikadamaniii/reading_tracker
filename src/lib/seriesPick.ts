import type { Book } from '../types'

/**
 * If `book` belongs to a series, resolve to the earliest book in that series
 * that hasn't been finished yet (checked across ALL books, not just TBR,
 * since earlier entries may already be sitting in the Library as finished
 * or in-progress). Falls back to `book` itself if it isn't part of a series,
 * or if series order info is missing.
 */
export function resolveSeriesPick(book: Book, allBooks: Book[]): Book {
  if (!book.series_name) return book

  const seriesBooks = allBooks
    .filter((b) => b.series_name === book.series_name && b.series_order != null)
    .sort((a, b) => (a.series_order as number) - (b.series_order as number))

  const nextUnread = seriesBooks.find((b) => b.status !== 'finished')
  return nextUnread ?? book
}
