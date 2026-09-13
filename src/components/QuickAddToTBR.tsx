import { useMemo, useState } from 'react'
import { enrichBookFromTitleAuthor } from '../lib/googleBooks'
import type { Book, NewBook } from '../types'
import formStyles from './BookForm.module.css'
import styles from './QuickAddToTBR.module.css'

interface QuickAddToTBRProps {
  books: Book[]
  onAddMany: (books: Partial<NewBook>[]) => Promise<void>
  onClose: () => void
}

type Mode = 'standalone' | 'series'

interface Row {
  title: string
  author: string
}

function nextSeriesOrder(name: string, allBooks: Book[]): number {
  const normalized = name.trim().toLowerCase()
  const existingOrders = allBooks
    .filter((b) => (b.series_name ?? '').trim().toLowerCase() === normalized)
    .map((b) => b.series_order ?? 0)
  return existingOrders.length === 0 ? 1 : Math.max(...existingOrders) + 1
}

export function QuickAddToTBR({ books, onAddMany, onClose }: QuickAddToTBRProps) {
  const [mode, setMode] = useState<Mode>('standalone')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [seriesName, setSeriesName] = useState('')
  const [rows, setRows] = useState<Row[]>([{ title: '', author: '' }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const existingSeriesNames = useMemo(
    () => [...new Set(books.map((b) => b.series_name).filter(Boolean) as string[])].sort(),
    [books],
  )

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  function addRow() {
    setRows((prev) => [...prev, { title: '', author: '' }])
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmitStandalone(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const enrichment = await enrichBookFromTitleAuthor(title, author || null)
      await onAddMany([
        {
          title: title.trim(),
          author: author.trim() || null,
          status: 'tbr',
          series_name: null,
          series_order: null,
          ...enrichment,
        },
      ])
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add book — try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmitSeries(e: React.FormEvent) {
    e.preventDefault()
    const validRows = rows.filter((r) => r.title.trim())
    if (!seriesName.trim() || validRows.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const startOrder = nextSeriesOrder(seriesName, books)
      const enrichments = await Promise.all(
        validRows.map((r) => enrichBookFromTitleAuthor(r.title, r.author || null)),
      )
      const newBooks: Partial<NewBook>[] = validRows.map((r, i) => ({
        title: r.title.trim(),
        author: r.author.trim() || null,
        status: 'tbr',
        series_name: seriesName.trim(),
        series_order: startOrder + i,
        ...enrichments[i],
      }))
      await onAddMany(newBooks)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add books — try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const seriesButtonCount = rows.filter((r) => r.title.trim()).length || rows.length

  return (
    <div className={formStyles.overlay} onClick={onClose}>
      <div className={formStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={formStyles.header}>
          <h3>Add to TBR</h3>
          <button className={formStyles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.modeToggle}>
          <button
            type="button"
            className={mode === 'standalone' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => setMode('standalone')}
          >
            Standalone
          </button>
          <button
            type="button"
            className={mode === 'series' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => setMode('series')}
          >
            Series
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {mode === 'standalone' ? (
          <form onSubmit={handleSubmitStandalone}>
            <label className={formStyles.field}>
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
            </label>
            <label className={formStyles.field}>
              Author
              <input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </label>
            <div className={formStyles.footer}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add to TBR'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitSeries}>
            <label className={formStyles.field}>
              Series name
              <input
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                list="series-options"
                placeholder="e.g. Throne of Glass"
                required
                autoFocus
              />
              <datalist id="series-options">
                {existingSeriesNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </label>

            <div className={styles.rows}>
              {rows.map((row, i) => (
                <div className={styles.row} key={i}>
                  <input
                    placeholder={`Book ${i + 1} title`}
                    value={row.title}
                    onChange={(e) => updateRow(i, { title: e.target.value })}
                  />
                  <input
                    placeholder="Author"
                    value={row.author}
                    onChange={(e) => updateRow(i, { author: e.target.value })}
                  />
                  {rows.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeRowBtn}
                      onClick={() => removeRow(i)}
                      aria-label="Remove row"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost" onClick={addRow}>
              + Add another book
            </button>

            <div className={formStyles.footer}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? 'Adding…'
                  : `Add ${seriesButtonCount} book${seriesButtonCount === 1 ? '' : 's'} to TBR`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
