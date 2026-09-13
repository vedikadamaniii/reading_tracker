-- Run this once in the Supabase SQL Editor for your project.

create type book_status as enum ('tbr', 'reading', 'finished');

create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  cover_url text,
  google_books_id text,
  genre text,
  page_count integer,
  series_name text,
  series_order integer,
  status book_status not null default 'tbr',
  rating numeric(2,1) check (rating between 1 and 5 and rating * 2 = round(rating * 2)),
  date_started date,
  date_finished date,
  notes text,
  created_at timestamptz not null default now()
);

create index books_status_idx on books (status);
create index books_date_finished_idx on books (date_finished);
create index books_series_name_idx on books (series_name);

create table goals (
  year integer primary key,
  target_count integer not null
);

-- No login screen in this app, so RLS is enabled but kept permissive
-- (the anon key ships in the frontend bundle either way). See README
-- for the security tradeoff this implies.
alter table books enable row level security;
alter table goals enable row level security;

create policy "public read/write books" on books for all using (true) with check (true);
create policy "public read/write goals" on goals for all using (true) with check (true);
