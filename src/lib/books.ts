import { supabase } from './supabase'
import type { Book, NewBook } from '../types'

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Book[]
}

export async function addBook(book: Partial<NewBook>): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()

  if (error) throw error
  return data as Book
}

export async function addBooks(books: Partial<NewBook>[]): Promise<Book[]> {
  const { data, error } = await supabase.from('books').insert(books).select()

  if (error) throw error
  return data as Book[]
}

export async function updateBook(id: string, changes: Partial<NewBook>): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Book
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}
