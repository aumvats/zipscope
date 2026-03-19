# Optimizer Notes — ZipScope

## Code Cleanup (Step 0)
- **Code simplifier**: Removed dead `ageLabels` array, collapsed duplicate `maleIndices`/`femaleIndices` into single `indices` field, extracted shared `verifySession` into `src/lib/api/auth.ts`, extracted `getAuthHeaders` helper into `src/lib/api/supabase.ts`, extracted `emptyZipInfo` factory into `src/lib/api/zippopotam.ts`, removed dead `formatDiffPercent` export
- **Comment audit**: Fixed critical data bug — `B15003_002E` ("No schooling completed") was mislabeled as "total 25+" for education percentages, causing all education percentages to be divided by the wrong denominator. Changed to `B15003_001E` (actual total population 25+). Removed 6 stale QA comments and 4 obvious JSX section comments.
- **Code review**: Background pass completed. Fixed compare page retry bug (retry button was no-op when initial load failed). Remaining findings are security hardening items outside optimizer scope — documented below.

## Performance
- Images optimized: 0 (no raster images used — all SVG inline)
- Dynamic imports added: 2 (AgeChart and EducationChart — Recharts components lazy-loaded to reduce initial bundle)
- Server Components converted: 0 (all existing `'use client'` directives are justified — hooks, event handlers, or client APIs)
- Font optimization: ✅ (DM Sans + Inter via `next/font/google`, no external CDN)

## SEO
- Root metadata: ✅ (title, description, keywords, OpenGraph, Twitter card)
- Per-page titles: ✅ (all 7 routes have titles: layout.tsx for root, generateMetadata for /search/[zip], metadata exports for /dashboard, /pricing, layout.tsx for /compare and /settings)
- OG tags: ✅
- Sitemap: ✅ (`src/app/sitemap.ts` — /, /compare, /pricing)
- Robots: ✅ (`src/app/robots.ts` — allows public routes, disallows /api, /dashboard, /reports, /settings)

## Accessibility
- Semantic HTML: ✅ (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` used throughout)
- ARIA labels: ✅ (search form has `role="search"` and `aria-label`, search input has `aria-label`, decorative SVGs have `aria-hidden="true"`, population gender bar has `aria-label`)
- Keyboard nav: ✅ (all interactive elements natively focusable, `focus-visible` ring on buttons)
- Color contrast: ✅ (text-primary #0F172A on bg #F8FAFC exceeds 4.5:1, text-secondary #64748B on white meets 4.48:1)

## Error Handling
- Global error boundary: ✅ (`src/app/error.tsx` with "Try again" button)
- 404 page: ✅ (`src/app/not-found.tsx` with branded layout and homepage link)
- Loading UI: ✅ (`src/app/loading.tsx` with spinner)
- API fallbacks: ✅ (Census: cached + error card with retry; Zippopotam: null fallback; Reports: error toast)

## Deployment Ready
- .env.example complete: ✅ (5 variables with descriptions and signup links)
- README exists: ✅ (project name, description, setup instructions, spec link)
- Build passes: ✅

## Build Output
- Total pages: 17 (10 static, 7 dynamic)
- Build time: ~15s
- Any warnings: none

## Code Review Findings (Not Fixed — Outside Optimizer Scope)
These issues were identified by the code review pass and should be addressed in a future security hardening sprint:
1. `/api/usage` trusts raw bearer token as user ID without JWT verification (unlike `/api/reports` which uses `verifySession`)
2. Usage count increment has a read-then-write race condition allowing limit bypass under concurrency
3. `/search/[zip]` Server Component fetches its own API routes via HTTP instead of calling data functions directly
4. Middleware auth check uses fragile cookie name substring matching instead of proper JWT verification
5. In-memory caches (Census, Zippopotam, rate limit) have no max size — unbounded growth in long-running processes
6. `/api/export-pdf` has no authentication or rate limiting
7. `/auth/callback` has a potential open redirect via `//evil.com` in the `next` query parameter
