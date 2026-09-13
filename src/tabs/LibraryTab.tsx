import { useMemo, useState } from 'react'
import { BookCard } from '../components/BookCard'
import { BookForm } from '../components/BookForm'
import type { Book, NewBook } from '../types'
import styles from './shared.module.css'

interface LibraryTabProps {
  books: Book[]
  onAdd: (book: Partial<NewBook>) => Promise<void>
  onUpdate: (id: string, changes: Partial<NewBook>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function LibraryTab({ books, onAdd, onUpdate, onDelete }: LibraryTabProps) {
  const [editing, setEditing] = useState<Book | 'new' | null>(null)

  const reading = useMemo(() => books.filter((b) => b.status === 'reading'), [books])
  const finished = useMemo(
    () =>
      books
        .filter((b) => b.status === 'finished')
        .sort((a, b) => (b.date_finished ?? '').localeCompare(a.date_finished ?? '')),
    [books],
  )

  async function handleSave(data: Partial<NewBook>) {
    if (editing && editing !== 'new') {
      await onUpdate(editing.id, data)
    } else {
      await onAdd(data)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h2>Library</h2>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + Add book
        </button>
      </div>

      {reading.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Currently reading</div>
          <div className={styles.list}>
            {reading.map((book) => (
              <BookCard key={book.id} book={book}>
                <button
                  className="btn btn-ghost"
                  onClick={() =>
                    setEditing({
                      ...book,
                      status: 'finished',
                      date_finished: new Date().toISOString().slice(0, 10),
                    })
                  }
                >
                  Mark finished
                </button>
                <button className="btn btn-ghost" onClick={() => setEditing(book)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => onDelete(book.id)}>
                  Delete
                </button>
              </BookCard>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Finished</div>
        {finished.length === 0 ? (
          <div className={styles.empty}>No finished books yet — mark one done from TBR!</div>
        ) : (
          <div className={styles.list}>
            {finished.map((book) => (
              <BookCard key={book.id} book={book}>
                <button className="btn btn-ghost" onClick={() => setEditing(book)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => onDelete(book.id)}>
                  Delete
                </button>
              </BookCard>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <BookForm
          initial={
            editing === 'new'
              ? { status: 'finished', date_finished: new Date().toISOString().slice(0, 10) }
              : editing
          }
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
