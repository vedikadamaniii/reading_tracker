import { useState } from 'react'
import { searchGoogleBooks } from '../lib/googleBooks'
import type { GoogleBookResult } from '../types'
import styles from './GoogleBooksSearch.module.css'

interface GoogleBooksSearchProps {
  onAdd: (result: GoogleBookResult) => Promise<void> | void
  addedIds: Set<string>
}

export function GoogleBooksSearch({ onAdd, addedIds }: GoogleBooksSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GoogleBookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await searchGoogleBooks(query)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed — try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(result: GoogleBookResult) {
    setAddingId(result.googleBooksId)
    try {
      await onAdd(result)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.searchRow} onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or vibe (e.g. 'cozy fantasy with found family')"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
      <div className={styles.hint}>
        Try "books like The Secret History" or describe a vibe — powered by Google Books.
      </div>
      {error && <div className={styles.hint}>{error}</div>}
      <div className={styles.results}>
        {results.map((r) => {
          const added = addedIds.has(r.googleBooksId)
          return (
            <div className={styles.result} key={r.googleBooksId}>
              {r.thumbnail ? (
                <img className={styles.thumb} src={r.thumbnail} alt="" />
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}
              <div className={styles.resultBody}>
                <div className={styles.resultTitle}>{r.title}</div>
                {r.authors.length > 0 && (
                  <div className={styles.resultAuthor}>{r.authors.join(', ')}</div>
                )}
                {r.description && <div className={styles.resultDesc}>{r.description}</div>}
                <div className={styles.resultFooter}>
                  <button
                    className="btn btn-ghost"
                    disabled={added || addingId === r.googleBooksId}
                    onClick={() => handleAdd(r)}
                  >
                    {added ? 'In your TBR' : addingId === r.googleBooksId ? 'Adding…' : 'Add to TBR'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
