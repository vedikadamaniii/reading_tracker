import { useMemo, useState } from 'react'
import type { Book } from '../types'
import styles from './FavoritesShelf.module.css'

const LEATHERS = ['#5a2624', '#2f4234', '#243248', '#4a3423', '#3e2638', '#6b4a22', '#2c2a26', '#4d2a1f']

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

interface FavoritesShelfProps {
  books: Book[]
}

export function FavoritesShelf({ books }: FavoritesShelfProps) {
  const [active, setActive] = useState<Book | null>(null)

  const favorites = useMemo(
    () =>
      books
        .filter((b) => b.status === 'finished' && b.rating === 5)
        .sort((a, b) => (b.date_finished ?? '').localeCompare(a.date_finished ?? '')),
    [books],
  )

  if (favorites.length === 0) return null

  return (
    <section className={styles.wrap} aria-label="Five-star shelf">
      <div className={styles.shelf} onMouseLeave={() => setActive(null)}>
        {favorites.map((book) => {
          const h = hash(book.title)
          return (
            <button
              key={book.id}
              type="button"
              className={styles.spine}
              style={{
                width: `${20 + (h % 11)}px`,
                height: `${122 + ((h >> 4) % 30)}px`,
                backgroundColor: LEATHERS[(h >> 8) % LEATHERS.length],
              }}
              onMouseEnter={() => setActive(book)}
              onFocus={() => setActive(book)}
              onBlur={() => setActive(null)}
              aria-label={`${book.title}${book.author ? ` by ${book.author}` : ''}`}
            >
              <span className={styles.spineTitle}>{book.title}</span>
            </button>
          )
        })}
      </div>
      <div className={styles.ledge} aria-hidden="true" />
      <p className={styles.placard} aria-live="polite">
        {active ? (
          <>
            <em>{active.title}</em>
            {active.author && <span className={styles.placardAuthor}> — {active.author}</span>}
          </>
        ) : (
          <>
            The Five-Star Shelf{' '}
            <span className={styles.placardAuthor}>
              · {favorites.length} volumes{favorites.length > 24 && ' · scroll to browse'}
            </span>
          </>
        )}
      </p>
    </section>
  )
}
