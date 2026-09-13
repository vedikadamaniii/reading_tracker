import { useState } from 'react'
import type { Book, BookStatus, NewBook } from '../types'
import { GENRES } from '../types'
import { StarPicker } from './Stars'
import styles from './BookForm.module.css'

interface BookFormProps {
  initial?: Partial<Book>
  onSave: (book: Partial<NewBook>) => Promise<void> | void
  onClose: () => void
}

const emptyForm: Partial<NewBook> = {
  title: '',
  author: '',
  cover_url: null,
  genre: null,
  page_count: null,
  series_name: null,
  series_order: null,
  status: 'tbr',
  rating: null,
  date_started: null,
  date_finished: null,
  notes: '',
}

export function BookForm({ initial, onSave, onClose }: BookFormProps) {
  const [form, setForm] = useState<Partial<NewBook>>({ ...emptyForm, ...initial })
  const [saving, setSaving] = useState(false)

  function set<K extends keyof NewBook>(key: K, value: NewBook[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title?.trim()) return
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{initial?.title ? 'Edit book' : 'Add a book'}</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <label className={`${styles.field} ${styles.fieldFull}`}>
              Title
              <input
                value={form.title ?? ''}
                onChange={(e) => set('title', e.target.value)}
                required
                autoFocus
              />
            </label>
            <label className={`${styles.field} ${styles.fieldFull}`}>
              Author
              <input value={form.author ?? ''} onChange={(e) => set('author', e.target.value)} />
            </label>
            <label className={styles.field}>
              Genre
              <select
                value={form.genre ?? ''}
                onChange={(e) => set('genre', e.target.value || null)}
              >
                <option value="">—</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              Pages
              <input
                type="number"
                min={0}
                value={form.page_count ?? ''}
                onChange={(e) => set('page_count', e.target.value ? Number(e.target.value) : null)}
              />
            </label>
            <label className={styles.field}>
              Series name
              <input
                value={form.series_name ?? ''}
                onChange={(e) => set('series_name', e.target.value || null)}
                placeholder="e.g. Throne of Glass"
              />
            </label>
            <label className={styles.field}>
              Position in series
              <input
                type="number"
                min={1}
                value={form.series_order ?? ''}
                onChange={(e) =>
                  set('series_order', e.target.value ? Number(e.target.value) : null)
                }
              />
            </label>
            <label className={styles.field}>
              Status
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as BookStatus)}
              >
                <option value="tbr">To be read</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
              </select>
            </label>
            <label className={styles.field}>
              Rating
              <StarPicker rating={form.rating ?? null} onChange={(r) => set('rating', r)} />
            </label>
            <label className={styles.field}>
              Date started
              <input
                type="date"
                value={form.date_started ?? ''}
                onChange={(e) => set('date_started', e.target.value || null)}
              />
            </label>
            <label className={styles.field}>
              Date finished
              <input
                type="date"
                value={form.date_finished ?? ''}
                onChange={(e) => set('date_finished', e.target.value || null)}
              />
            </label>
            <label className={`${styles.field} ${styles.fieldFull}`}>
              Notes
              <textarea
                rows={2}
                value={form.notes ?? ''}
                onChange={(e) => set('notes', e.target.value)}
              />
            </label>
          </div>
          <div className={styles.footer}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
