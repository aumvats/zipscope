# Deploy Notes — ZipScope

## Pre-flight
- Build: ✅ PASS (17 pages, 0 warnings)
- No secrets: ✅ (SUPABASE_SERVICE_ROLE_KEY is env var reference only)
- .gitignore: ✅ (covers node_modules, .next, .vercel, .env*)
- .env.example: ✅ (5 variables documented)

## Deployment
- GitHub repo: https://github.com/aumvats/zipscope
- Vercel URL: https://zipscope.vercel.app
- projects.json updated: ✅
- Factory repo pushed: ✅

## Environment Variables Needed
Set these in the Vercel dashboard for full functionality:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
- `NEXT_PUBLIC_APP_URL` — Production URL (https://zipscope.vercel.app)
- `CENSUS_API_KEY` — US Census Bureau API key (free at api.census.gov)

## Verification
- Live URL loads: ✅
- GitHub repo accessible: ✅
- Portfolio updated: ✅

## Status
**DEPLOYED** — 2026-03-19
