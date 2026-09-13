import { useMemo, useState } from 'react'
import { BookCard } from '../components/BookCard'
import { BookForm } from '../components/BookForm'
import { GoogleBooksSearch } from '../components/GoogleBooksSearch'
import { Ornament } from '../components/Ornament'
import { QuickAddToTBR } from '../components/QuickAddToTBR'
import { RandomPickButton } from '../components/RandomPickButton'
import type { Book, GoogleBookResult, NewBook } from '../types'
import styles from './shared.module.css'

interface TBRTabProps {
  books: Book[]
  onAdd: (book: Partial<NewBook>) => Promise<void>
  onAddMany: (books: Partial<NewBook>[]) => Promise<void>
  onUpdate: (id: string, changes: Partial<NewBook>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

type SubTab = 'series' | 'standalone'

export function TBRTab({ books, onAdd, onAddMany, onUpdate, onDelete }: TBRTabProps) {
  const [editing, setEditing] = useState<Book | 'new' | null>(null)
  const [subTab, setSubTab] = useState<SubTab>('series')

  const tbr = useMemo(() => books.filter((b) => b.status === 'tbr'), [books])
  const tbrGoogleIds = useMemo(
    () => new Set(tbr.map((b) => b.google_books_id).filter(Boolean) as string[]),
    [tbr],
  )

  const standalone = useMemo(() => tbr.filter((b) => !b.series_name), [tbr])

  const seriesGroups = useMemo(() => {
    const bySeries = new Map<string, Book[]>()
    for (const b of tbr) {
      if (!b.series_name) continue
      if (!bySeries.has(b.series_name)) bySeries.set(b.series_name, [])
      bySeries.get(b.series_name)!.push(b)
    }
    return [...bySeries.entries()]
      .map(([name, seriesBooks]) => ({
        name,
        books: [...seriesBooks].sort((a, b) => (a.series_order ?? 0) - (b.series_order ?? 0)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [tbr])

  async function handleSave(data: Partial<NewBook>) {
    if (editing && editing !== 'new') {
      await onUpdate(editing.id, data)
    }
  }

  async function handleAddFromSearch(result: GoogleBookResult) {
    await onAdd({
      title: result.title,
      author: result.authors.join(', ') || null,
      cover_url: result.thumbnail,
      google_books_id: result.googleBooksId,
      genre: result.categories[0] ?? null,
      page_count: result.pageCount,
      status: 'tbr',
    })
  }

  function bookActions(book: Book) {
    return (
      <>
        <button
          className="btn btn-ghost"
          onClick={() =>
            onUpdate(book.id, {
              status: 'reading',
              date_started: new Date().toISOString().slice(0, 10),
            })
          }
        >
          Start reading
        </button>
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
          Mark as read
        </button>
        <button className="btn btn-ghost" onClick={() => setEditing(book)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(book.id)}>
          Delete
        </button>
      </>
    )
  }

  return (
    <div>
      <div className={styles.header}>
        <h2>To Be Read</h2>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + Add manually
        </button>
      </div>

      <div className={styles.section}>
        <RandomPickButton tbrBooks={tbr} allBooks={books} />
      </div>

      <Ornament className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Find something new</div>
        <GoogleBooksSearch onAdd={handleAddFromSearch} addedIds={tbrGoogleIds} />
      </div>

      <Ornament className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Your list ({tbr.length})</div>

        <div className={styles.subNav}>
          <button
            className={`${styles.subNavBtn} ${subTab === 'series' ? styles.subNavBtnActive : ''}`}
            onClick={() => setSubTab('series')}
          >
            Series ({seriesGroups.reduce((n, g) => n + g.books.length, 0)})
          </button>
          <button
            className={`${styles.subNavBtn} ${subTab === 'standalone' ? styles.subNavBtnActive : ''}`}
            onClick={() => setSubTab('standalone')}
          >
            Standalone ({standalone.length})
          </button>
        </div>

        {subTab === 'series' &&
          (seriesGroups.length === 0 ? (
            <div className={styles.empty}>
              No series tagged yet — add a "Series name" when editing a book to group it here.
            </div>
          ) : (
            seriesGroups.map((group) => (
              <div key={group.name} className={styles.seriesGroup}>
                <div className={styles.seriesGroupTitle}>
                  {group.name}
                  <span className={styles.seriesGroupCount}>{group.books.length} on TBR</span>
                </div>
                <div className={styles.list}>
                  {group.books.map((book, i) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      badge={
                        i === 0 ? <span className={styles.upNextBadge}>Up next</span> : undefined
                      }
                    >
                      {bookActions(book)}
                    </BookCard>
                  ))}
                </div>
              </div>
            ))
          ))}

        {subTab === 'standalone' &&
          (standalone.length === 0 ? (
            <div className={styles.empty}>No standalone books on your TBR yet.</div>
          ) : (
            <div className={styles.list}>
              {standalone.map((book) => (
                <BookCard key={book.id} book={book}>
                  {bookActions(book)}
                </BookCard>
              ))}
            </div>
          ))}
      </div>

      {editing === 'new' && (
        <QuickAddToTBR books={books} onAddMany={onAddMany} onClose={() => setEditing(null)} />
      )}
      {editing && editing !== 'new' && (
        <BookForm initial={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
