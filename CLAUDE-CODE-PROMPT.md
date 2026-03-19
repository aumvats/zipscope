# Build Constraints — ZipScope

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (charting library for demographic visualizations)
- Supabase (auth + database for saved reports and usage tracking)

## Design System

```
Colors:
  primary:       #0D9488
  bg:            #F8FAFC
  surface:       #FFFFFF
  border:        #E2E8F0
  text-primary:  #0F172A
  text-secondary:#64748B
  accent:        #14B8A6
  success:       #10B981
  error:         #EF4444
  warning:       #F59E0B

Typography:
  heading-font:  DM Sans
  body-font:     Inter
  h1: 2rem (32px), weight 700
  h2: 1.5rem (24px), weight 600
  h3: 1.125rem (18px), weight 600
  body: 0.9375rem (15px), line-height 1.6

Spacing:
  base-unit: 4px
  scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

Border Radius:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

Animation:
  fast:   120ms ease-out
  normal: 200ms ease-out
  slow:   350ms ease-out

Mode: light
```

## API Integrations

| API | Base URL | Auth |
|-----|---------|------|
| US Census Bureau (ACS 5-Year) | `https://api.census.gov/data` | API Key (env: `CENSUS_API_KEY`) |
| Data USA | `https://datausa.io/api/data` | None |
| Zippopotam.us | `https://api.zippopotam.us` | None |
| Nominatim (v2 only) | `https://nominatim.openstreetmap.org` | None (User-Agent required) |

## Build Rules
- npm run build MUST pass before you consider any agent done
- No placeholder content (lorem ipsum, "coming soon", fake data)
- No external images unless from a free CDN — use SVG icons
- Error states must be visible in the UI, not just console.log
- Mobile-responsive by default
- Census API key must NEVER appear in client-side code — all Census calls go through Next.js API routes
- All API responses must be cached server-side for 24 hours minimum
- Zippopotam.us responses should be cached indefinitely (ZIP-to-city mappings don't change)
- Every data panel must have a skeleton loading state
- Every API failure must show a user-visible error message with retry option

## v1 Scope Boundary
- Landing page with centered ZIP search bar and value proposition
- Single ZIP dashboard with 6 data panels: population, median household income, age distribution (bar chart), educational attainment (donut chart), housing (median home value + median rent), employment status
- ZIP validation and city/state enrichment via Zippopotam.us
- Census Bureau ACS 5-Year API integration (~15 demographic variables in one call)
- Compare view for 2 ZIPs side-by-side with difference indicators
- User accounts via Supabase Auth (Google OAuth)
- Save up to 5 reports (free) or 50 reports (Pro)
- PDF export of single ZIP report (one-page professional layout)
- Free tier (10 lookups/month) + Pro tier ($19/month)
- 24-hour server-side caching of all API responses
- Mobile-responsive layout (cards stack vertically on small screens)
- Skeleton loading states for all data panels
- Error handling for invalid ZIPs, API failures, and rate limit exhaustion
