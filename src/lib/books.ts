import library from '../data/library.json'
import type { Book, NewBook } from '../types'

// The library ships with the site (built from the spreadsheet by
// scripts/build-static-library.mjs), so there's no database to go down.
// Edits made on the page last until the page is reloaded.
let books = library as Book[]

export async function getBooks(): Promise<Book[]> {
  return [...books].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

function toBook(book: Partial<NewBook>): Book {
  return {
    title: '',
    author: null,
    cover_url: null,
    google_books_id: null,
    genre: null,
    page_count: null,
    series_name: null,
    series_order: null,
    status: 'tbr',
    rating: null,
    date_started: null,
    date_finished: null,
    notes: null,
    ...book,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
}

export async function addBook(book: Partial<NewBook>): Promise<Book> {
  const created = toBook(book)
  books = [created, ...books]
  return created
}

export async function addBooks(newBooks: Partial<NewBook>[]): Promise<Book[]> {
  const created = newBooks.map(toBook)
  books = [...created, ...books]
  return created
}

export async function updateBook(id: string, changes: Partial<NewBook>): Promise<Book> {
  const existing = books.find((b) => b.id === id)
  if (!existing) throw new Error(`No book with id ${id}`)
  const updated = { ...existing, ...changes }
  books = books.map((b) => (b.id === id ? updated : b))
  return updated
}

export async function deleteBook(id: string): Promise<void> {
  books = books.filter((b) => b.id !== id)
}
