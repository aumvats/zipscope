# ZipScope — Implementation Plan

## Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS (custom design tokens)
- Charts: Recharts
- Auth: Supabase Auth (Google OAuth)
- Database: Supabase PostgreSQL
- PDF: @react-pdf/renderer or puppeteer (server-side generation)
- Deployment: Vercel

## Project Setup
- Package manager: npm
- Key dependencies:
  - `next@14` `react@18` `react-dom@18` `typescript`
  - `tailwindcss` `postcss` `autoprefixer`
  - `@supabase/supabase-js` `@supabase/ssr`
  - `recharts`
  - `@react-pdf/renderer` (PDF generation, server-side)
  - `next-auth` — NOT used (Supabase Auth handles this)

### Environment Variables (.env.local)
```
CENSUS_API_KEY=your_census_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tailwind Config (tailwind.config.ts)
```ts
theme: {
  extend: {
    colors: {
      primary: '#0D9488',
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      border: '#E2E8F0',
      'text-primary': '#0F172A',
      'text-secondary': '#64748B',
      accent: '#14B8A6',
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
    },
    fontFamily: {
      heading: ['DM Sans', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    transitionDuration: {
      fast: '120ms',
      normal: '200ms',
      slow: '350ms',
    },
  },
}
```

## File Structure
```
src/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, Supabase session provider
│   ├── page.tsx                      # Landing page
│   ├── search/
│   │   └── [zip]/
│   │       └── page.tsx              # ZIP dashboard
│   ├── compare/
│   │   └── page.tsx                  # Side-by-side comparison
│   ├── dashboard/
│   │   └── page.tsx                  # My Reports (auth-required)
│   ├── reports/
│   │   └── [id]/
│   │       └── page.tsx              # Saved report viewer (auth-required)
│   ├── pricing/
│   │   └── page.tsx                  # Pricing page
│   ├── settings/
│   │   └── page.tsx                  # Account settings (auth-required)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts              # Supabase OAuth callback
│   └── api/
│       ├── census/
│       │   └── route.ts              # GET /api/census?zip=XXXXX (server-side, cached)
│       ├── zip-info/
│       │   └── route.ts              # GET /api/zip-info?zip=XXXXX (Zippopotam, cached)
│       ├── reports/
│       │   └── route.ts              # GET/POST /api/reports (save/list reports)
│       ├── reports/[id]/
│       │   └── route.ts              # GET/DELETE /api/reports/[id]
│       ├── export-pdf/
│       │   └── route.ts              # POST /api/export-pdf (PDF generation)
│       └── usage/
│           └── route.ts              # GET/POST /api/usage (lookup count tracking)
├── components/
│   ├── ui/
│   │   ├── SearchBar.tsx             # ZIP search input with validation
│   │   ├── SkeletonCard.tsx          # Generic skeleton loading placeholder
│   │   ├── ErrorCard.tsx             # Error state with retry button
│   │   ├── Badge.tsx                 # Comparison difference badge (green/red arrow)
│   │   ├── Toast.tsx                 # Toast notifications (bottom-right)
│   │   └── Button.tsx                # Shared button component
│   ├── layout/
│   │   ├── Header.tsx                # Global nav: logo, search bar, auth state
│   │   └── Footer.tsx                # Simple footer with attribution
│   └── features/
│       ├── dashboard/
│       │   ├── PopulationCard.tsx    # Population stat + 10-year change
│       │   ├── IncomeCard.tsx        # Median household income + national comparison
│       │   ├── AgeChart.tsx          # Bar chart: age distribution (Recharts)
│       │   ├── EducationChart.tsx    # Donut chart: education attainment (Recharts)
│       │   ├── HousingCard.tsx       # Median home value + median rent
│       │   ├── EmploymentCard.tsx    # Employment rate + employed/unemployed counts
│       │   └── DashboardShell.tsx    # Page wrapper: header + 6-panel grid
│       ├── compare/
│       │   ├── CompareInput.tsx      # Dual ZIP input fields
│       │   ├── CompareRow.tsx        # Single data row with 2 values + diff badge
│       │   └── CompareTable.tsx      # Full comparison layout using CompareRow
│       ├── landing/
│       │   ├── HeroSection.tsx       # Large search bar + tagline
│       │   ├── FeatureGrid.tsx       # 3-column value props
│       │   └── SamplePDFPreview.tsx  # Static screenshot of sample PDF export
│       └── reports/
│           ├── ReportCard.tsx        # Single saved report list item
│           └── ReportsList.tsx       # List of saved reports with actions
├── lib/
│   ├── api/
│   │   ├── census.ts                 # Server-side Census API client + cache Map
│   │   ├── zippopotam.ts             # ZIP validation/enrichment + permanent cache
│   │   └── supabase.ts               # Supabase client (server + browser variants)
│   ├── pdf/
│   │   └── generateReport.tsx        # @react-pdf/renderer report template
│   ├── utils/
│   │   ├── formatters.ts             # Currency, percentage, number formatters
│   │   ├── nationalAverages.ts       # Hardcoded US national averages for comparison badges
│   │   └── rateLimit.ts              # IP-based free-tier rate limiting (in-memory Map)
│   └── types/
│       └── index.ts                  # CensusData, ZipInfo, Report, UsageRecord types
└── middleware.ts                     # Auth guard for /dashboard, /reports, /settings
```

## Pages & Routes (build priority order)

### 1. Landing Page `/`
- Hero: large centered search bar (`SearchBar` component), tagline "Turn Census data into client-ready reports"
- Below hero: 3-column feature grid (15-second reports, compare ZIPs, save & export)
- Below features: static `SamplePDFPreview` (an SVG/image mockup of the PDF export)
- CTA: search bar submits to `/search/[zip]`

### 2. ZIP Dashboard `/search/[zip]`
- Server component fetches ZIP info + Census data on first load
- `DashboardShell` with 6-panel responsive grid (2-col desktop, 1-col mobile)
- Each panel: skeleton → real data at 200ms staggered fade-in
- "Compare" button top-right → navigates to `/compare?zip1=[zip]`
- "Save Report" button → prompts Google OAuth if unauthenticated, then saves via `/api/reports`
- "Export PDF" button → POST to `/api/export-pdf`, triggers file download

### 3. Compare ZIPs `/compare`
- Accepts `?zip1=&zip2=` query params
- `CompareInput` with two ZIP fields
- On both ZIPs entered: parallel fetch for both via `/api/census` and `/api/zip-info`
- `CompareTable` renders rows with `Badge` for positive/negative difference
- "Save Comparison" → auth prompt → saves `report_type: 'comparison'` to Supabase

### 4. Pricing Page `/pricing`
- Static page: 3-tier comparison table (Free / Pro $19 / Business $49 — display only, no Stripe for v1)
- Upgrade CTAs link to `/settings` or trigger auth flow

### 5. My Reports `/dashboard` (auth required)
- Lists saved reports from Supabase ordered by `created_at DESC`
- Each row: `ReportCard` with ZIP, city, state, date, type (single/comparison), Export PDF button
- Usage meter showing current month lookup count vs. plan limit
- "New Search" button → SearchBar or redirect to `/`

### 6. Saved Report `/reports/[id]` (auth required)
- Loads `data_snapshot JSONB` from Supabase
- Renders same 6-panel dashboard as `/search/[zip]` from snapshot data (no live API call)
- "Export PDF" and "Delete" actions

### 7. Account Settings `/settings` (auth required)
- Display name, email (read-only)
- Current plan (Free/Pro), upgrade link
- Sign out button

## Components Inventory

### `SearchBar`
- Props: `defaultValue?: string`, `onSearch: (zip: string) => void`, `error?: string`
- Validates 5-digit US ZIP client-side before submitting
- Red border + inline error message on invalid input
- Submits via router.push to `/search/[zip]`

### `SkeletonCard`
- Props: `className?: string`
- Animated pulse placeholder matching data card dimensions

### `Badge` (difference indicator)
- Props: `value: number`, `unit: 'percent' | 'absolute'`
- Green up-arrow if positive, red down-arrow if negative
- Shows formatted difference value

### `PopulationCard`
- Props: `total: number`, `change10yr?: number`
- National comparison: hardcoded US avg population context

### `IncomeCard`
- Props: `medianIncome: number`
- Compares to national median ($74,580 — 2022 ACS) with colored badge

### `AgeChart` (Recharts BarChart)
- Props: `ageGroups: { label: string; value: number }[]`
- Horizontal bars, teal fill, DM Sans labels

### `EducationChart` (Recharts PieChart)
- Props: `levels: { label: string; value: number }[]`
- Donut with 4 segments: No diploma, HS diploma, Some college, Bachelor's+

### `HousingCard`
- Props: `medianHomeValue: number`, `medianRent: number`

### `EmploymentCard`
- Props: `employmentRate: number`, `employed: number`, `unemployed: number`

### `CompareRow`
- Props: `label: string`, `zip1Value: number | string`, `zip2Value: number | string`, `format: 'currency' | 'percent' | 'number'`
- Highlights higher value in teal, lower in muted gray with diff badge

### `Toast`
- Global toast state via React context
- Positions bottom-right, red left-border for errors

## API Integration Plan

### `/api/census?zip=XXXXX` (internal Next.js route)
- Method: GET
- Server-side cache: `Map<string, {data, cachedAt}>` — invalidate if `Date.now() - cachedAt > 86400000`
- Census API call: `GET https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B19013_001E,B01001_002E,B01001_026E,B15003_017E,B15003_022E,B25077_001E,B25064_001E,B23025_004E,B23025_005E&for=zip+code+tabulation+area:XXXXX&key=CENSUS_API_KEY`
- Variables fetched:
  - `B01003_001E` — total population
  - `B19013_001E` — median household income
  - `B01001_002E` / `B01001_026E` — male/female totals (for age distribution use B01001_003E–B01001_025E for 5-yr groups)
  - `B15003_017E` — HS diploma; `B15003_022E` — bachelor's degree
  - `B25077_001E` — median home value
  - `B25064_001E` — median gross rent
  - `B23025_004E` — employed; `B23025_005E` — unemployed
- Full variable list: fetch B01001_003E through B01001_049E for age groups (use `for=zip+code+tabulation+area:XXXXX` with comma-separated vars, max 50 per call)
- Error: return 503 with `{ error: 'Census API unavailable' }` — client shows ErrorCard

### `/api/zip-info?zip=XXXXX` (internal Next.js route)
- Method: GET
- Calls `https://api.zippopotam.us/us/XXXXX`
- Cache: permanent `Map<string, ZipInfo>` (never expires)
- Returns `{ city, state, stateFull, lat, lng }`
- Error: return `{ zip, city: null, state: null }` — dashboard shows "ZIP XXXXX" in header

### `/api/reports` (internal Next.js route)
- GET: list user's reports from Supabase (requires auth session)
- POST body: `{ zip_code, city, state, data_snapshot, report_type }` — saves to `reports` table
- Checks usage limit before saving (free: 5 saved reports max)

### `/api/export-pdf` (internal Next.js route)
- POST body: `{ zip, city, state, data }`
- Uses `@react-pdf/renderer` server-side to generate Buffer
- Returns binary PDF with `Content-Type: application/pdf` and `Content-Disposition: attachment`
- PDF layout: A4, header (city/state/ZIP), 6 stat boxes in 2x3 grid, 2 mini charts, footer attribution

### `/api/usage` (internal Next.js route)
- GET: returns `{ count, limit, plan }` for current user or IP
- POST: increments lookup count; returns 429 if limit reached
- Free authenticated: 10 lookups/month in `usage` Supabase table
- Anonymous: 5/day tracked by IP hash in server-side `Map`

## Data Flow

### ZIP Lookup Flow
1. User enters ZIP → `SearchBar` validates 5-digit format → `router.push('/search/[zip]')`
2. `/search/[zip]` page (server component) → parallel: `fetch('/api/zip-info?zip=')` + `fetch('/api/census?zip=')`
3. Census route checks in-memory cache → if miss, calls Census Bureau API → stores in cache → returns
4. Page renders with data hydrated → charts rendered client-side via Recharts
5. Usage count incremented via `/api/usage` POST on page load

### Comparison Flow
1. `/compare?zip1=&zip2=` → `CompareInput` shows both fields
2. On second ZIP entered → two parallel `fetch('/api/census?zip=')` calls (client-side)
3. Both responses arrive → `CompareTable` renders with `Badge` diff indicators

### Save Report Flow
1. "Save Report" click → check auth state → if none, `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. On auth: POST to `/api/reports` with current `data_snapshot`
3. Report appears in Supabase `reports` table → toast confirmation

### PDF Export Flow
1. "Export PDF" click → POST to `/api/export-pdf` with current data
2. Server generates PDF bytes via `@react-pdf/renderer`
3. Response streamed as `application/pdf` → browser triggers download

## Supabase Schema (run as migrations)
```sql
-- reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  zip_code TEXT NOT NULL,
  city TEXT,
  state TEXT,
  data_snapshot JSONB NOT NULL,
  report_type TEXT CHECK (report_type IN ('single', 'comparison')) DEFAULT 'single',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own reports" ON reports FOR ALL USING (auth.uid() = user_id);

-- usage table
CREATE TABLE usage (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,  -- format: '2024-03'
  lookup_count INT DEFAULT 0,
  PRIMARY KEY (user_id, month)
);
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own usage" ON usage FOR ALL USING (auth.uid() = user_id);
```

## Build Order (step-by-step)

1. **Initialize project**
   ```bash
   npx create-next-app@14 zipscope --typescript --tailwind --app --src-dir --import-alias "@/*"
   ```

2. **Install dependencies**
   ```bash
   npm install recharts @supabase/supabase-js @supabase/ssr @react-pdf/renderer
   npm install -D @types/react-pdf
   ```

3. **Configure Tailwind** — extend `tailwind.config.ts` with design tokens above. Add Google Fonts import (DM Sans + Inter) to `src/app/layout.tsx` `<head>`.

4. **Set up Supabase** — create `src/lib/api/supabase.ts` with browser and server clients using `@supabase/ssr`. Run Supabase schema migrations.

5. **Create types** — `src/lib/types/index.ts`: define `CensusData`, `ZipInfo`, `Report`, `UsageRecord` interfaces.

6. **Build utilities** — `src/lib/utils/formatters.ts` (currency, percent, number), `src/lib/utils/nationalAverages.ts` (hardcoded US median values for badge comparisons), `src/lib/utils/rateLimit.ts` (IP Map with daily reset).

7. **Build API routes (server-side)**
   - `src/app/api/zip-info/route.ts` — Zippopotam call + permanent cache
   - `src/app/api/census/route.ts` — Census call + 24h cache, key must stay server-side
   - `src/app/api/usage/route.ts` — Supabase read/write + IP fallback
   - `src/app/api/reports/route.ts` — Supabase CRUD
   - `src/app/api/reports/[id]/route.ts` — get/delete single report
   - `src/app/api/export-pdf/route.ts` — @react-pdf/renderer generation

8. **Auth setup** — `src/app/auth/callback/route.ts` for OAuth redirect. `src/middleware.ts` to protect `/dashboard`, `/reports/*`, `/settings`.

9. **Build shared UI components** — `Header.tsx`, `Footer.tsx`, `SearchBar.tsx`, `SkeletonCard.tsx`, `ErrorCard.tsx`, `Badge.tsx`, `Toast.tsx`, `Button.tsx`.

10. **Build landing page** — `HeroSection.tsx`, `FeatureGrid.tsx`, `SamplePDFPreview.tsx`, compose in `src/app/page.tsx`.

11. **Build ZIP dashboard panels** — `PopulationCard.tsx`, `IncomeCard.tsx`, `AgeChart.tsx`, `EducationChart.tsx`, `HousingCard.tsx`, `EmploymentCard.tsx`. Each with skeleton and error state.

12. **Build `DashboardShell.tsx`** — responsive 2-col grid, action buttons (Compare, Save, Export PDF).

13. **Build `/search/[zip]/page.tsx`** — server component that calls internal API routes and hydrates dashboard.

14. **Build compare feature** — `CompareInput.tsx`, `CompareRow.tsx`, `CompareTable.tsx`, `/compare/page.tsx`.

15. **Build PDF template** — `src/lib/pdf/generateReport.tsx` with `@react-pdf/renderer` Document/Page/View/Text components.

16. **Build `/dashboard/page.tsx`** — report list, usage meter, New Search button.

17. **Build `/reports/[id]/page.tsx`** — load snapshot from Supabase, render dashboard panels from JSONB.

18. **Build `/pricing/page.tsx`** — static 3-tier table.

19. **Build `/settings/page.tsx`** — auth user display, sign out.

20. **Final: run `npm run build`** — fix all TypeScript errors, verify no client-side Census key exposure.

## Known Risks

- **Census ZCTA variable set:** Age distribution requires ~23 variables (B01001_003E–B01001_025E for males + B01001_027E–B01001_049E for females). Confirm all fit within the 50-variable limit per Census API call. If not, split into 2 calls.
- **@react-pdf/renderer bundle size:** This package can be large. Ensure it's only imported in the API route (server-side), never in client components. If bundle issues arise, consider puppeteer via a Vercel edge function instead.
- **Supabase RLS:** Service role key is needed for server-side operations that bypass RLS. Anon key is safe for client-side. Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- **Zippopotam.us availability:** Unconfirmed rate limits and SLA. If down, gracefully degrade to showing "ZIP XXXXX" without city/state.
- **Data USA deferred to v2:** Spec Section 3.2 describes Data USA integration, but Section 10 explicitly defers it. Do NOT build the Local Economy panel in v1.
- **Stripe/payments:** Spec mentions $19/mo Pro tier but does not include Stripe in v1 scope. Build upgrade CTAs as UI-only — they can link to a waitlist form or contact email for v1.
- **PDF export of comparison reports:** Section 10 explicitly defers this to v2. PDF export in v1 = single ZIP only.

## Plugin Usage Notes
- **Builder:** Use `/feature-dev` skill for `/search/[zip]/page.tsx` (complex data fetching + panel composition) and `/api/census/route.ts` (API client + cache logic)
- **Builder:** Use `/frontend-design` skill for `HeroSection.tsx` and `DashboardShell.tsx` with aesthetic direction: light-first, clean/professional, teal primary, DM Sans headings
- **QA:** Run `silent-failure-hunter` on `src/app/api/census/route.ts`, `src/app/api/export-pdf/route.ts`, and `src/lib/utils/rateLimit.ts`
- **QA:** Run `code-reviewer` on `src/middleware.ts` and all `/api/reports` routes (auth boundary enforcement)
- **Designer:** Aesthetic direction — light-first, minimal, professional. Teal (#0D9488) as data credibility signal. Clean card layouts with subtle borders. No gradients or decorative elements in v1.
