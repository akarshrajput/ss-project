-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  prompt_tags text,
  genre text,
  mood text,
  audio_url text,
  seed bigint,
  duration_seconds integer,
  model_name text,
  created_at timestamptz not null default now()
);

alter table public.songs enable row level security;

drop policy if exists "songs_select_own" on public.songs;
create policy "songs_select_own"
on public.songs
for select
using (auth.uid() = user_id);

drop policy if exists "songs_insert_own" on public.songs;
create policy "songs_insert_own"
on public.songs
for insert
with check (auth.uid() = user_id);

drop policy if exists "songs_delete_own" on public.songs;
create policy "songs_delete_own"
on public.songs
for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('songs', 'songs', true)
on conflict (id) do nothing;

drop policy if exists "songs_bucket_read_public" on storage.objects;
create policy "songs_bucket_read_public"
on storage.objects
for select
using (bucket_id = 'songs');

drop policy if exists "songs_bucket_upload_own" on storage.objects;
create policy "songs_bucket_upload_own"
on storage.objects
for insert
with check (
  bucket_id = 'songs'
  and auth.uid()::text = split_part(name, '/', 1)
);

drop policy if exists "songs_bucket_delete_own" on storage.objects;
create policy "songs_bucket_delete_own"
on storage.objects
for delete
using (
  bucket_id = 'songs'
  and auth.uid()::text = split_part(name, '/', 1)
);
