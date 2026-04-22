# Songify - Production Next.js App

A production-structured Next.js 16 web app for AI song generation using ComfyUI (RunPod), Supabase auth, Supabase database, and Supabase storage.

## Product rules implemented

- Public routes:
	- `/`
	- `/studio`
	- `/login`
	- `/register`
- Protected routes (login required via Supabase session):
	- `/dashboard`
	- `/library`
	- `/account`
- Studio behavior:
	- Guests can generate one song and listen to it
	- Download and extended account workflows require login/register
	- Authenticated users can generate, persist to storage, and view in library

## Stack

- Next.js 16 (App Router)
- TypeScript
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Zod for API payload validation
- Tailwind CSS 4

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
COMFYUI_BASE_URL=https://e54wgks2f9mg8n-7865.proxy.runpod.net
```

`COMFYUI_BASE_URL` is optional. If omitted, the provided default endpoint is used.

## Supabase setup

1. Open Supabase SQL editor.
2. Run `supabase/migrations/001_init.sql`.
3. Ensure Email/Password auth is enabled in Supabase Auth settings.

This creates:

- `public.songs` table
- RLS policies for user-scoped access
- public `songs` storage bucket
- upload/read/delete policies scoped by user folder path prefix

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

- `POST /api/songs/generate`
	- Validates payload with Zod
	- Builds ComfyUI workflow
	- Sends prompt to RunPod ComfyUI
	- Polls `/history/:promptId` until audio is available
	- Returns direct audio URL
	- If authenticated: uploads MP3 to Supabase Storage and inserts metadata into `songs`

## Project structure

- `src/app` - routes and route handlers
- `src/components` - reusable UI components
- `src/lib/supabase` - Supabase server/browser helpers
- `src/lib/song` - prompt/tag/workflow builders and types
- `src/proxy.ts` - auth gate for protected routes (Next.js 16 Proxy)

## Notes

- If your ComfyUI deployment has cold start latency, first generation can take longer.
- If CORS/network errors happen from server route calls, verify RunPod endpoint availability and ACL settings.
