# Reading Tracker

A personal reading tracker: log books you've read and want to read, get a
random pick when you can't decide, and discover new books via Google Books
search.

## Stack

- React + Vite (TypeScript)
- Supabase (Postgres) for storage, called directly from the frontend
- Google Books API for search/recommendations
- Deployed on Vercel

## Local setup

1. Install dependencies: `npm install`
2. Create a free project at [supabase.com](https://supabase.com).
3. In the Supabase SQL Editor, run `supabase/schema.sql`.
4. Copy your Project URL and anon public key from Project Settings → API.
5. Get a free Google Books API key (see below) — without one, search hits a
   shared quota that's frequently exhausted and search will fail.
6. Copy `.env.example` to `.env.local` and fill in all three values.
7. `npm run dev`

### Getting a Google Books API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and
   create a project (or pick an existing one).
2. Search for **"Books API"** under APIs & Services → Library, and enable it.
3. Go to APIs & Services → Credentials → **Create Credentials → API key**.
4. Optionally restrict the key (Credentials → edit the key) to the Books API
   and to your domains (`localhost`, your Vercel URL) — it ships in the
   frontend bundle, so restricting it limits who else can use your quota.
5. Put it in `.env.local` as `VITE_GOOGLE_BOOKS_API_KEY`. Free tier is ~1,000
   queries/day, far more than personal use needs.

## Deploying (Vercel)

1. Push this repo to GitHub (already connected as `origin`).
2. In Vercel, "Add New Project" → import this repo. It auto-detects the
   Vite preset.
3. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and
   `VITE_GOOGLE_BOOKS_API_KEY` as environment variables in Vercel before
   deploying.
4. Deploy — every push to `main` auto-redeploys.

## Security note

There's no login screen; this is a single-user app. Row-level security is
enabled on the Supabase tables but the policies are permissive, so anyone
with the deployed URL and anon key could read/write the data. The anon key
ships in the frontend bundle regardless of RLS settings, so this is a
deliberate tradeoff for a low-stakes personal reading log — no sensitive
data is stored, and the anon key can't reach the Supabase dashboard or
admin functions. Add Supabase Auth later if that ever needs to change.

## Notes on recommendations

The "books like X" / vibe search uses the Google Books API's own text
relevance ranking — it's good at surfacing a named book, its author's other
work, and keyword-y vibes, but it isn't a semantic recommender, so it won't
always understand vague descriptions the way an LLM would.
