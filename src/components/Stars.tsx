import styles from './Stars.module.css'

/** Read-only star display. Supports half-star fills (e.g. rating = 4.5). */
export function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, rating - (n - 1)))
        return (
          <span key={n} className={styles.slot}>
            <span className={styles.bg}>★</span>
            <span className={styles.fg} style={{ width: `${fill * 100}%` }}>
              ★
            </span>
          </span>
        )
      })}
    </span>
  )
}

interface StarPickerProps {
  rating: number | null
  onChange: (rating: number | null) => void
}

/** Interactive star picker for BookForm. Click the left/right half of a star to set a half or whole rating. */
export function StarPicker({ rating, onChange }: StarPickerProps) {
  function getClickedRating(e: React.MouseEvent<HTMLSpanElement>, starIndex: number): number {
    const box = e.currentTarget.getBoundingClientRect()
    const onLeftHalf = e.clientX - box.left < box.width / 2
    return onLeftHalf ? starIndex - 0.5 : starIndex
  }

  function handleClick(e: React.MouseEvent<HTMLSpanElement>, starIndex: number) {
    const value = getClickedRating(e, starIndex)
    onChange(rating === value ? null : value)
  }

  const display = rating ?? 0

  return (
    <span className={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, display - (n - 1)))
        return (
          <span
            key={n}
            className={`${styles.slot} ${styles.picker}`}
            onClick={(e) => handleClick(e, n)}
          >
            <span className={styles.bg}>★</span>
            <span className={styles.fg} style={{ width: `${fill * 100}%` }}>
              ★
            </span>
          </span>
        )
      })}
    </span>
  )
}
