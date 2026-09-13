import type { ReactNode } from 'react'
import type { Book } from '../types'
import { Stars } from './Stars'
import styles from './BookCard.module.css'

function initials(title: string) {
  return title.trim().charAt(0).toUpperCase() || '?'
}

function formatDate(date: string | null) {
  if (!date) return null
  return new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface BookCardProps {
  book: Book
  children?: ReactNode
  badge?: ReactNode
}

export function BookCard({ book, children, badge }: BookCardProps) {
  const dateRange = [formatDate(book.date_started), formatDate(book.date_finished)]
    .filter(Boolean)
    .join(' – ')

  return (
    <div className={styles.card}>
      {book.cover_url ? (
        <img className={styles.cover} src={book.cover_url} alt="" />
      ) : (
        <div className={styles.coverPlaceholder}>{initials(book.title)}</div>
      )}
      <div className={styles.body}>
        <div className={styles.title}>
          {book.title}
          {badge}
        </div>
        {book.author && <div className={styles.author}>{book.author}</div>}
        <div className={styles.meta}>
          {book.genre && <span>{book.genre}</span>}
          {book.page_count != null && <span className={styles.dot}>{book.page_count}</span>}
          {book.rating != null && (
            <span className={`${styles.stars} ${styles.dot}`}>
              <Stars rating={book.rating} />
            </span>
          )}
          {dateRange && <span className={styles.dot}>{dateRange}</span>}
        </div>
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </div>
  )
}
