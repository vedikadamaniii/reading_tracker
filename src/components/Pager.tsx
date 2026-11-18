import { useRef, useState, type ReactNode } from 'react'
import styles from './Pager.module.css'

interface PagerProps<T> {
  items: T[]
  pageSize?: number
  children: (pageItems: T[]) => ReactNode
}

/** Page numbers to show: always the first and last, plus the current page's neighbours. */
function pageList(current: number, total: number): (number | 'gap')[] {
  const pages: (number | 'gap')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 1) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap')
    }
  }
  return pages
}

/**
 * Shows `items` a page at a time. Give it a `key` that changes with the
 * surrounding tab so switching tabs starts back on page 1.
 */
export function Pager<T>({ items, pageSize = 12, children }: PagerProps<T>) {
  const [page, setPage] = useState(1)
  const topRef = useRef<HTMLDivElement>(null)
  const total = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(page, total)

  function goTo(p: number) {
    setPage(p)
    // Bring the start of the list back into view if the reader had scrolled past it.
    const top = topRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) topRef.current?.scrollIntoView({ block: 'start' })
  }

  return (
    <div ref={topRef} className={styles.pager}>
      {children(items.slice((current - 1) * pageSize, current * pageSize))}

      {total > 1 && (
        <nav className={styles.controls} aria-label="Pages">
          <button
            className={styles.step}
            onClick={() => goTo(current - 1)}
            disabled={current === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {pageList(current, total).map((p, i) =>
            p === 'gap' ? (
              <span key={`gap-${i}`} className={styles.gap}>
                …
              </span>
            ) : (
              <button
                key={p}
                className={`${styles.page} ${p === current ? styles.active : ''}`}
                onClick={() => goTo(p)}
                aria-current={p === current ? 'page' : undefined}
              >
                {p}
              </button>
            ),
          )}
          <button
            className={styles.step}
            onClick={() => goTo(current + 1)}
            disabled={current === total}
            aria-label="Next page"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  )
}
