# Builder Agent Notes

## Build Status
- npm run build: PASS
- Pages built: `/`, `/search/[zip]`, `/compare`, `/dashboard`, `/reports/[id]`, `/pricing`, `/settings`
- Core feature working: YES (end-to-end ZIP lookup, comparison, PDF export, saved reports)

## What Was Built
1. **Landing page** (`/`) — Hero with large search bar, 3-column feature grid, sample PDF preview mockup
2. **ZIP Dashboard** (`/search/[zip]`) — Server-rendered page fetching Census + Zippopotam data, 6 data panels: Population, Income, Age Distribution (bar chart), Education (donut chart), Housing, Employment. Each with national comparison badges.
3. **Compare** (`/compare`) — Client-side dual ZIP input, parallel data fetching, side-by-side table with color-coded difference badges
4. **My Reports** (`/dashboard`) — Lists saved reports from Supabase, delete actions, empty state
5. **Saved Report** (`/reports/[id]`) — Loads snapshot from Supabase, renders same dashboard panels from stored data
6. **Pricing** (`/pricing`) — Static 3-tier comparison (Free / Pro $19 / Business $49)
7. **Settings** (`/settings`) — Account info display, plan status, sign-out button
8. **API Routes** — `/api/census` (24h cache), `/api/zip-info` (permanent cache), `/api/reports` (CRUD), `/api/export-pdf` (react-pdf), `/api/usage` (rate limiting)
9. **PDF Export** — `@react-pdf/renderer` server-side generation, A4 layout with all 6 stat boxes, age/education bars, source attribution footer
10. **Auth** — Supabase OAuth callback route, middleware protecting `/dashboard`, `/reports/*`, `/settings`

## Deferred / Skipped
- Data USA "Local Economy" panel — explicitly deferred to v2 per spec Section 10
- City-name search via Nominatim — v2 feature
- 3-ZIP comparison — v2
- Business tier with team access, white-label PDFs, CSV export — v2
- Stripe/payments integration — v2 (upgrade CTAs are UI-only)
- Comparison report PDF export — v2
- Historical trend charts — v2

## Known Issues
- Supabase auth requires actual Supabase project credentials in `.env.local` to function. Without credentials, the middleware will redirect protected routes to homepage.
- The `auth/callback/route.ts` uses `exchangeCodeForSession` which requires Supabase server client with proper cookie handling. For production, consider using `@supabase/ssr` `createServerClient` with cookie adapters.
- PDF generation uses `@react-pdf/renderer` which adds significant bundle weight server-side. This is only imported in the API route, never client-side.

## API Status
- Census Bureau: Server-side only, 24h cached, requires `CENSUS_API_KEY` env var
- Zippopotam.us: Permanently cached, no auth needed, graceful fallback if unreachable
- Supabase: Requires project credentials for auth/reports/usage functionality
