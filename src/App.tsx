import { useEffect, useMemo, useState } from 'react'
import styles from './App.module.css'
import { Epigraph } from './components/Epigraph'
import { FavoritesShelf } from './components/FavoritesShelf'
import { Ornament } from './components/Ornament'
import { TabNav, type TabKey } from './components/TabNav'
import { addBook, addBooks, deleteBook, getBooks, updateBook } from './lib/books'
import { findCoverForBook } from './lib/googleBooks'
import { getGoal, upsertGoal } from './lib/goals'
import { LibraryTab } from './tabs/LibraryTab'
import { ProgressTab } from './tabs/ProgressTab'
import { TBRTab } from './tabs/TBRTab'
import type { Book, Goal, NewBook } from './types'

const CURRENT_YEAR = new Date().getFullYear()
const LOAD_TIMEOUT_MS = 8000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms),
    ),
  ])
}

function App() {
  const [tab, setTab] = useState<TabKey>('tbr')
  const [books, setBooks] = useState<Book[]>([])
  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  const nowReading = useMemo(() => books.filter((b) => b.status === 'reading'), [books])

  async function loadAll() {
    setLoading(true)
    setUnavailable(false)
    try {
      const [booksData, goalData] = await withTimeout(
        Promise.all([getBooks(), getGoal(CURRENT_YEAR)]),
        LOAD_TIMEOUT_MS,
      )
      setBooks(booksData)
      setGoal(goalData)
    } catch (err) {
      console.error(err)
      setUnavailable(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(book: Partial<NewBook>) {
    let cover_url = book.cover_url
    if (!cover_url && book.title) {
      cover_url = await findCoverForBook(book.title, book.author)
    }
    const created = await addBook({ ...book, cover_url })
    setBooks((prev) => [created, ...prev])
  }

  async function handleAddMany(books: Partial<NewBook>[]) {
    const created = await addBooks(books)
    setBooks((prev) => [...created, ...prev])
  }

  async function handleUpdate(id: string, changes: Partial<NewBook>) {
    const updated = await updateBook(id, changes)
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }

  async function handleDelete(id: string) {
    await deleteBook(id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }

  async function handleSaveGoal(targetCount: number) {
    const saved = await upsertGoal({ year: CURRENT_YEAR, target_count: targetCount })
    setGoal(saved)
  }

  return (
    <div className={styles.app}>
      <header className={styles.masthead}>
        <div className={styles.eyebrow}>Ex Libris</div>
        <h1 className={styles.title}>Reading Tracker</h1>
        <Ornament className={styles.ornament} />
        <Epigraph />
        {nowReading.length > 0 && (
          <p className={styles.nowReading}>
            <span className={styles.nowReadingLabel}>Now reading</span>
            {nowReading.map((b, i) => (
              <span key={b.id}>
                {i > 0 && <span className={styles.nowReadingSep}> &amp; </span>}
                <em>{b.title}</em>
                {b.author && <span className={styles.nowReadingAuthor}>, {b.author}</span>}
              </span>
            ))}
          </p>
        )}
      </header>

      {!loading && !unavailable && (
        <div className={styles.shelfWrap}>
          <FavoritesShelf books={books} />
        </div>
      )}

      <div className={styles.tabWrap}>
        <TabNav active={tab} onChange={setTab} />
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.stateMessage}>Loading your library…</div>
        ) : unavailable ? (
          <div className={styles.stateMessage}>
            The library is temporarily unavailable. Please check back soon.
          </div>
        ) : (
          <>
            {tab === 'library' && (
              <LibraryTab
                books={books}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            )}
            {tab === 'tbr' && (
              <TBRTab
                books={books}
                onAdd={handleAdd}
                onAddMany={handleAddMany}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            )}
            {tab === 'progress' && (
              <ProgressTab
                books={books}
                goal={goal}
                year={CURRENT_YEAR}
                onSaveGoal={handleSaveGoal}
              />
            )}
          </>
        )}
      </div>

      <footer className={styles.colophon}>
        <Ornament className={styles.ornament} />
      </footer>
    </div>
  )
}

export default App
