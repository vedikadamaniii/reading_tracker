// Shared helpers for the one-time CSV import scripts.

// Minimal CSV line parser that respects double-quoted fields containing commas.
export function parseCsvLine(line) {
  const fields = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      fields.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  fields.push(cur)
  return fields
}

export function toIsoDate(mmddyyyy) {
  const trimmed = mmddyyyy.trim()
  if (!trimmed) return null
  const [month, day, year] = trimmed.split('/')
  if (!month || !day || !year) return null
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function roundToHalf(value) {
  return Math.round(value * 2) / 2
}

export function normalizeTitle(title) {
  return title.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function requireSupabaseEnv(dryRun) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
  if (!dryRun && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
    console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the environment first.')
    process.exit(1)
  }
  return { SUPABASE_URL, SUPABASE_ANON_KEY }
}

export async function fetchExistingTitles(SUPABASE_URL, SUPABASE_ANON_KEY) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books?select=title`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })
  if (!res.ok) {
    console.error('Failed to fetch existing books:', res.status, await res.text())
    process.exit(1)
  }
  const rows = await res.json()
  return new Set(rows.map((r) => normalizeTitle(r.title)))
}

export async function insertBooks(SUPABASE_URL, SUPABASE_ANON_KEY, books) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/books`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(books),
  })
  if (!res.ok) {
    console.error('Import failed:', res.status, await res.text())
    process.exit(1)
  }
}
