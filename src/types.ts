export type BookStatus = 'tbr' | 'reading' | 'finished'

export interface Book {
  id: string
  title: string
  author: string | null
  cover_url: string | null
  google_books_id: string | null
  genre: string | null
  page_count: number | null
  series_name: string | null
  series_order: number | null
  status: BookStatus
  rating: number | null
  date_started: string | null
  date_finished: string | null
  notes: string | null
  created_at: string
}

export type NewBook = Omit<Book, 'id' | 'created_at'>

export interface Goal {
  year: number
  target_count: number
}

export interface GoogleBookResult {
  googleBooksId: string
  title: string
  authors: string[]
  thumbnail: string | null
  description: string
  pageCount: number | null
  categories: string[]
}

export const GENRES = [
  'Fiction',
  'Fantasy',
  'Sci-Fi',
  'Mystery',
  'Romance',
  'Nonfiction',
  'Memoir',
  'Horror',
  'Historical',
  'Poetry',
  'Other',
]
