import { useMemo, useState } from 'react'
import { StatBlock } from '../components/StatBlock'
import type { Book, Goal } from '../types'
import styles from './ProgressTab.module.css'
import shared from './shared.module.css'

interface ProgressTabProps {
  books: Book[]
  goal: Goal | null
  year: number
  onSaveGoal: (targetCount: number) => Promise<void>
}

export function ProgressTab({ books, goal, year, onSaveGoal }: ProgressTabProps) {
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(String(goal?.target_count ?? 12))

  const finishedThisYear = useMemo(
    () => books.filter((b) => b.status === 'finished' && b.date_finished?.startsWith(String(year))),
    [books, year],
  )

  const totalPages = finishedThisYear.reduce((sum, b) => sum + (b.page_count ?? 0), 0)
  const rated = finishedThisYear.filter((b) => b.rating != null)
  const avgRating = rated.length
    ? (rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length).toFixed(1)
    : '—'

  const genreCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const b of finishedThisYear) {
      const genre = b.genre ?? 'Uncategorized'
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [finishedThisYear])

  const maxGenreCount = genreCounts[0]?.[1] ?? 1
  const target = goal?.target_count ?? 0
  const progressPct = target > 0 ? Math.min(100, (finishedThisYear.length / target) * 100) : 0

  async function handleSaveGoal() {
    const n = Number(goalInput)
    if (!Number.isFinite(n) || n <= 0) return
    await onSaveGoal(n)
    setEditingGoal(false)
  }

  return (
    <div>
      <div className={shared.header}>
        <h2>Progress</h2>
      </div>

      <div className={styles.goalCard}>
        <div className={styles.goalHeader}>
          <span>{year} reading goal</span>
          <span className={styles.goalCount}>
            {finishedThisYear.length} / {target || '—'}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
        {editingGoal ? (
          <div className={styles.goalEditRow}>
            <input
              type="number"
              min={1}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSaveGoal}>
              Save
            </button>
            <button className="btn btn-ghost" onClick={() => setEditingGoal(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className={styles.goalEditRow}>
            <button className="btn btn-ghost" onClick={() => setEditingGoal(true)}>
              {goal ? 'Edit goal' : 'Set a goal'}
            </button>
          </div>
        )}
      </div>

      <div className={styles.statsGrid}>
        <StatBlock value={finishedThisYear.length} label="Books finished this year" />
        <StatBlock value={totalPages.toLocaleString()} label="Pages read this year" />
        <StatBlock value={avgRating} label="Average rating" />
      </div>

      <div className={shared.section}>
        <div className={shared.sectionTitle}>Genre breakdown</div>
        {genreCounts.length === 0 ? (
          <div className={shared.empty}>Finish a book this year to see your genre mix.</div>
        ) : (
          <div className={styles.genreList}>
            {genreCounts.map(([genre, count]) => (
              <div className={styles.genreRow} key={genre}>
                <span>{genre}</span>
                <div className={styles.genreBarTrack}>
                  <div
                    className={styles.genreBarFill}
                    style={{ width: `${(count / maxGenreCount) * 100}%` }}
                  />
                </div>
                <span>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
