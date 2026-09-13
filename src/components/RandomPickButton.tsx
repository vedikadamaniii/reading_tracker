import { useState } from 'react'
import { resolveSeriesPick } from '../lib/seriesPick'
import type { Book } from '../types'
import styles from './RandomPickButton.module.css'

interface RandomPickButtonProps {
  /** Candidate pool to pick from — your TBR list. */
  tbrBooks: Book[]
  /** All books, used to resolve a series pick to its earliest unread entry. */
  allBooks: Book[]
}

export function RandomPickButton({ tbrBooks, allBooks }: RandomPickButtonProps) {
  const [pick, setPick] = useState<Book | null>(null)

  function pickRandom() {
    if (tbrBooks.length === 0) return
    const choice = tbrBooks[Math.floor(Math.random() * tbrBooks.length)]
    setPick(resolveSeriesPick(choice, allBooks))
  }

  return (
    <div className={styles.wrap}>
      <svg className={styles.candle} viewBox="0 0 34 64" aria-hidden="true">
        <g className={styles.flame}>
          <path d="M17 6 C22 13 22 19 17 22 C12 19 12 13 17 6 Z" fill="#e8b35a" opacity="0.9" />
          <path d="M17 12 C19 15 19 18 17 20 C15 18 15 15 17 12 Z" fill="#fff1c9" />
        </g>
        <path d="M17 22 V26" stroke="#2a211a" strokeWidth="1.2" />
        <rect x="10" y="26" width="14" height="30" rx="1.5" fill="#e9dfc9" opacity="0.85" />
        <path d="M10 30 c3 2 5 -1 7 1 s4 3 7 0" fill="none" stroke="#c9b894" strokeWidth="1" />
        <path d="M4 58 H30 L27 62 H7 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <div className={styles.content}>
        <div className={styles.title}>Can't decide what to read next?</div>
        <button className="btn btn-primary" onClick={pickRandom} disabled={tbrBooks.length === 0}>
          Draw a book from the TBR
        </button>
        {pick && (
          <div className={styles.pick}>
            <span className={styles.pickTitle}>{pick.title}</span>
            {pick.author && <span className={styles.pickAuthor}>by {pick.author}</span>}
            {pick.series_name && (
              <span className={styles.pickAuthor}>
                ({pick.series_name} #{pick.series_order})
              </span>
            )}
          </div>
        )}
        {tbrBooks.length === 0 && <div className={styles.hint}>Add some books to your TBR first.</div>}
      </div>
    </div>
  )
}
