# ZipScope — Product Specification

> Turn Census data into client-ready demographic reports in 15 seconds. The professional output layer for US ZIP code intelligence.

---

## 1. Product Overview

ZipScope turns raw US Census data into polished, exportable demographic reports for real estate agents, franchise developers, and location analysts. The core insight: looking up demographics for a ZIP code is free — Census Reporter, data.census.gov, and Social Explorer all let you browse population, income, and education data at no cost. What none of them do is produce a **client-ready output**: a branded PDF you can attach to a listing package, a side-by-side comparison with percentage-difference badges you can screenshot for a franchise review meeting, or a saved report library you can reference across quarters.

ZipScope is not a Census data browser. It is a **demographic report builder** that happens to use Census data as its engine. Enter a ZIP, get a professional dashboard. Click Export, get a one-page PDF with key stats, mini-charts, and source attribution — ready to drop into a client email. Click Compare, see two ZIPs side-by-side with color-coded difference indicators that make the decision obvious in 10 seconds. Save reports to build a library of location analyses over time.

The alternative for professionals today: spend 2 hours manually copying numbers from census.gov into a slide deck (error-prone, ugly), or pay $5,000+/year for enterprise GIS tools like Esri (overkill for a 6-number summary). ZipScope sits in the gap — professional output quality at $19/month.

### Competitive Landscape

| Competitor | What It Does Well | What It Lacks | ZipScope's Advantage |
|-----------|-------------------|---------------|---------------------|
| **Census Reporter** (free) | Clean UI, enter any geography, see demographics with charts and parent-geography comparisons | No PDF export, no side-by-side ZIP comparison, no saved reports, no professional presentation layer | ZipScope is the output tool Census Reporter is not — export-ready PDFs, comparison badges, report library |
| **data.census.gov** (free) | Official source, improved profile pages for ZCTAs, complete dataset access | Dense UI designed for researchers not professionals, no export formatting, steep learning curve | ZipScope extracts the 6 numbers professionals actually need and formats them for client delivery |
| **Social Explorer** (free tier + paid) | Academic-grade census visualization, generous free tier, historical data | Oriented toward researchers and students, no professional report output, complex interface | ZipScope is purpose-built for business users who need answers in 15 seconds, not 15 minutes |
| **PolicyMap** (institutional) | Rich neighborhood-level data overlays, used by community development orgs | Institutional pricing, not designed for individual professionals, no quick-export workflow | ZipScope serves the individual agent or franchise analyst, not the institution |
| **Esri** ($5,000+/year) | Industry-standard GIS, complete spatial analysis toolkit | Massive overkill and cost for "give me the demographics of this ZIP code" | ZipScope delivers the 80% of location intelligence that 80% of professionals need, at 0.3% of the cost |

**Positioning statement:** Free tools give you the data. Enterprise tools give you everything. ZipScope gives professionals the **output** — the formatted report, the instant comparison, the saved library — at a price that fits on a solo agent's expense report.

---

## 2. Target Personas

**Persona 1: Derek — Commercial Real Estate Agent (Primary Revenue Persona)**
- Role: Junior commercial real estate agent at a small brokerage, handles 15–20 clients/year
- Core pain: He creates "market analysis" sections in listing packages by manually copying numbers from census.gov into presentation slides. It takes 2 hours per package and the data is often wrong because he pulled the wrong table. He needs this 15–20 times per year — consistent, recurring professional use.
- Price sensitivity: Expenses tools up to $100/mo through his brokerage. Currently uses Canva Pro ($15/mo) and a CRM ($30/mo).
- First "aha" moment: He enters a ZIP, clicks "Export PDF," and gets a professional one-page market summary he can drop straight into a client package — what used to take 2 hours took 15 seconds.
- **Why he stays subscribed:** Every new listing needs a fresh demographic package. He uses ZipScope 2–3 times per month, year-round. The PDF export alone justifies the $19/mo.

**Persona 2: Priya — Franchise Development Manager (High-Frequency Power User)**
- Role: Evaluates expansion territories for a frozen yogurt franchise (30 locations, growing)
- Core pain: She needs to compare 5–10 ZIP codes per week to assess franchise viability. Currently maintains a spreadsheet with manually pulled census data that goes stale within months. Census Reporter gives her the numbers but she still has to copy them into a comparison spreadsheet by hand.
- Price sensitivity: Company expense card covers $200+/mo for tools. Currently pays $89/mo for a basic franchise analytics tool and wants something faster for the demographic slice.
- First "aha" moment: She uses the Compare view to put 2 candidate ZIPs side-by-side, sees one has 3x the target-age population and 20% higher disposable income — the decision is obvious in 10 seconds. No spreadsheet needed.
- **Why she stays subscribed:** 5–10 comparisons per week, every week. The saved report library becomes her territory analysis archive. She'd notice immediately if ZipScope disappeared.

**Persona 3: Maria — Independent Salon Owner (Free-Tier Discovery User)**
- Role: Owner of a single-location hair salon doing $350K/year revenue, evaluating a second location
- Core pain: She wants to open a second location but doesn't know which neighborhood has the right demographics (women 25–55, household income $60K+) and keeps wasting weekends driving around random areas with zero data.
- Price sensitivity: Would not sustain a monthly subscription — she needs demographics 1–3 times total while scouting her second location.
- First "aha" moment: She enters her current salon's ZIP code, sees the demographic breakdown matches her customer base perfectly, then enters a ZIP she's been considering and sees the median income is 40% lower — she immediately knows to look elsewhere.
- **Why she matters (not as a subscriber):** Maria represents the free-tier viral discovery path. She finds ZipScope via Google, gets instant value without paying, and tells her real estate agent about it — who becomes a Derek. Maria validates that the product is useful enough to generate word-of-mouth. She is not a revenue persona.

---

## 3. API Integrations

### 3.1 US Census Bureau — American Community Survey 5-Year Estimates

- **Base URL:** `https://api.census.gov/data`
- **Auth:** API Key (free — email signup at census.gov/data/key_signup.html, no credit card required)
- **Rate limit:** 500 queries per IP per day without key; effectively unlimited for registered API keys (Census Bureau documentation states no hard cap for registered users, but asks for reasonable use)
- **Data provided:** Population (table B01003), median household income (B19013), age and sex distribution (B01001), educational attainment (B15003), median home value (B25077), poverty status (B17001), employment status (B23025), commute patterns (B08301), total housing units (B25001), median gross rent (B25064)
- **How it's used in ZipScope:** Core data source. When a user enters a ZIP code, ZipScope's server-side API route sends a single Census request fetching ~15 variables for that ZCTA (ZIP Code Tabulation Area). The response is transformed into dashboard panels: population card, income card, age distribution bar chart, education donut chart, housing cost card, and employment stats card. All variables are fetched in one request by comma-separating variable codes.
- **Failure mode:** Return 24-hour cached data if available (Census data updates annually, so a 24-hour cache loses nothing). Display a subtle "Data as of [cache timestamp]" badge. If no cache exists and the API is down, show a full-page message: "Census data temporarily unavailable — please try again in a few minutes" with a retry button. Never show a half-loaded dashboard.

### 3.2 Data USA

- **Base URL:** `https://datausa.io/api/data`
- **Auth:** None
- **Rate limit:** Unknown (public API maintained by Datawheel, designed for open use)
- **Data provided:** Top industries by employment share, top occupations, average wage by occupation, year-over-year employment growth — aggregated by geography (county/metro area, mapped from ZIP)
- **How it's used in ZipScope:** Supplements Census demographic data with economic context. Powers the "Local Economy" panel showing top 5 industries, top 5 occupations by employment share, and employment growth trend. ZIP is mapped to the containing county or metro area for this query.
- **Failure mode:** Omit the "Local Economy" panel entirely and show a muted placeholder card: "Industry data currently unavailable." The remaining 5 Census-powered panels display normally. This panel is supplementary — losing it doesn't break the core experience.

### 3.3 Zippopotam.us

- **Base URL:** `https://api.zippopotam.us`
- **Auth:** None
- **Rate limit:** Unknown (lightweight, stateless API — historically generous)
- **Data provided:** ZIP code → city name, state, state abbreviation, latitude, longitude, country code
- **How it's used in ZipScope:** Instant ZIP code validation and enrichment. When a user types a ZIP and presses Enter, this is the first API call — it confirms the ZIP exists and returns the city/state name for the dashboard header (e.g., "Austin, TX 78701") and lat/lng coordinates for the optional map pin.
- **Failure mode:** Accept the raw ZIP input without city/state enrichment. Dashboard header shows "ZIP 78701" instead of "Austin, TX 78701." Map pin is skipped. All demographic data loads normally from Census.

### 3.4 Nominatim (OpenStreetMap)

- **Base URL:** `https://nominatim.openstreetmap.org`
- **Auth:** None (requires a descriptive User-Agent header per Nominatim usage policy)
- **Rate limit:** 1 request per second (strict — Nominatim blocks clients that exceed this)
- **Data provided:** Forward geocoding — search by city name or address → lat/lng, bounding box, address components including postcode
- **How it's used in ZipScope:** Powers the city-name search feature (v2). If a user types "Beverly Hills" instead of a ZIP code, Nominatim resolves it to coordinates and a postcode, which ZipScope then uses for the Census lookup. This is a secondary input method for users who don't know the ZIP code.
- **Failure mode:** Disable the city-name search option entirely. Show only the ZIP code input field with a hint: "Enter a 5-digit US ZIP code." The core product works perfectly without Nominatim — it's a convenience feature.

### API Cost Per User Calculation (Rule Compliance)

| Tier | Lookups/month | Census API calls | Data USA calls | Zippopotam calls | Total API calls |
|------|--------------|------------------|----------------|------------------|-----------------|
| Free | 10 | 10 | 10 | 10 | 30 |
| Pro ($19/mo) | ~100 (est.) | 100 | 100 | 100 | 300 |
| Business ($49/mo) | ~300 (est.) | 300 | 300 | 300 | 900 |

With 24-hour caching, repeat lookups of the same ZIP cost zero API calls. Popular ZIPs (top 200 in the US) will be cache-hot within the first week of launch.

At 1,000 total users (mix of tiers): ~50,000 Census API calls/month. Census Bureau free tier handles this comfortably — no paid API tier exists or is needed. All other APIs have no documented limits that would be exceeded. **No API costs at any scale achievable within the first 2 years.**

---

## 4. Core User Flows

### Onboarding Flow (2 steps to value — under 15 seconds)

1. **User lands on homepage** → sees a large, centered search bar with placeholder text "Enter a US ZIP code (e.g., 90210)" and the tagline "Turn Census data into client-ready reports"
2. **User types a ZIP code and presses Enter** → redirected to `/search/[zip]`
3. **Dashboard loads with full demographic breakdown in < 2 seconds** — no signup, no email, no configuration required

### Flow 1: Quick ZIP Lookup

1. User enters ZIP code "78701" in the search bar on any page
2. **System:** Validates ZIP via Zippopotam.us → resolves to "Austin, TX" → displays in header
3. **System:** Fetches Census ACS 5-Year data for ZCTA 78701 (server-side, cached)
4. **System:** Fetches Data USA industry data for the containing county (client-side)
5. Dashboard renders six panels: population card (with 10-year change %), median income card (with comparison to national median), age distribution bar chart, education attainment donut chart, housing card (median home value + median rent), employment status card
6. User scrolls and explores each section — every number has a subtle comparison to the national average

### Flow 2: Compare Two ZIPs Side-by-Side

1. From any ZIP dashboard, user clicks the "Compare" button in the top-right
2. **System:** Shows a second ZIP input field next to the current ZIP
3. User enters a second ZIP code
4. **System:** Fetches data for the second ZIP in parallel
5. Dashboard switches to comparison layout: two columns, identical rows, with color-coded difference badges (green arrow = higher value, red arrow = lower value)
6. User sees at a glance which ZIP has higher income, younger population, cheaper housing, etc.
7. User clicks "Save Comparison" → prompted to create a free account (Google OAuth, one click)

### Flow 3: Save and Export a Report

1. User viewing a ZIP dashboard clicks "Save Report" → prompted to sign up if not logged in
2. **System:** Saves the current data snapshot + ZIP + timestamp to Supabase
3. Report appears in user's dashboard at `/dashboard` with ZIP, city name, and date
4. User clicks "Export PDF" → system generates a one-page professional PDF with all demographic data and charts
5. PDF downloads to user's device within 5 seconds
6. User returns to `/dashboard` at any time to access saved reports

---

## 5. Design System

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

Light mode is the default and only mode for v1. The audience is real estate agents and franchise developers who work in well-lit offices and expect professional, clean interfaces. The teal primary (#0D9488) communicates data credibility and calm authority without the sterile coldness of pure blue. The warm off-white background (#F8FAFC) ensures charts and data cards have maximum contrast while feeling approachable rather than clinical. DM Sans headings are geometric and modern but friendlier than Inter alone — important for a non-technical audience that needs to trust the data at a glance.

---

## 6. Routes

| Path | Page Name | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | Landing | No | Marketing page with prominent ZIP search bar, value proposition emphasizing report output, sample PDF screenshot |
| `/search/:zip` | ZIP Dashboard | No | Full demographic dashboard for a single ZIP code — the core experience |
| `/compare` | Compare ZIPs | No (free: 1/day, Pro: unlimited) | Side-by-side comparison of 2 ZIP codes with difference badges |
| `/dashboard` | My Reports | Yes | Saved reports library, recent lookups, usage meter |
| `/reports/:id` | Saved Report | Yes | View a previously saved report with export options |
| `/pricing` | Pricing | No | Plan comparison and upgrade flow |
| `/settings` | Account Settings | Yes | Profile, email, plan management |

---

## 7. Pricing

### Free — $0/mo
- 10 ZIP lookups per month
- Basic demographics: population, median income, age distribution
- 1 comparison per day (2 ZIPs)
- No saved reports or PDF export
- **Who it's for:** One-time researchers, small business owners scouting a single location, viral discovery users (the Marias)
- **Upgrade trigger:** Hits the 10-lookup limit, or tries to save a report / export a PDF

### Pro — $19/mo
- Unlimited ZIP lookups
- Full demographic suite: adds education, housing, commute, poverty, employment panels
- Unlimited comparisons (2 ZIPs side-by-side)
- 50 saved reports
- PDF export with ZipScope branding and source attribution
- Industry and occupation data (Data USA panels)
- **Who it's for:** Solo real estate agents building client packages (Derek), individual analysts doing regular location research
- **Why they pay:** The PDF export alone replaces 2 hours of manual census.gov data assembly per listing. At $19/mo and 2 listings/month, that's $9.50 per 2 hours saved.

### Business — $49/mo
- Everything in Pro
- Unlimited saved reports
- White-label PDF export (upload custom logo, remove ZipScope branding)
- Team access (up to 5 members)
- CSV data export (raw numbers for spreadsheet analysis)
- Priority data refresh (newest ACS release loaded within 48 hours of Census publication)
- **Who it's for:** Real estate brokerages, franchise development teams (Priya's company), market research consultancies
- **Why they pay:** Team access + white-label PDFs + CSV export for integration with existing franchise analysis workflows

---

## 8. Key User Flows (Detailed)

### Flow 1: First-Time Visitor Discovers ZipScope

1. User finds ZipScope via Google search for "demographics by zip code" or "zip code demographic report"
2. Lands on `/` — sees a clean landing page with a large search bar, the tagline "Turn Census data into client-ready reports," and a sample PDF export screenshot below
3. Types their own ZIP code out of curiosity and presses Enter
4. **System:** Validates ZIP via Zippopotam.us (< 200ms)
5. **System:** Redirects to `/search/[zip]` — page loads with skeleton card placeholders
6. **System:** Census API response arrives (< 1.5s) — cards animate in with real data using a 200ms staggered fade
7. User sees: population (42,581), median household income ($78,200), age distribution bar chart, education attainment donut, median home value ($425,000), employment rate (94.2%)
8. Each number shows a subtle comparison badge vs. national average (e.g., income "↑ 18% above national median")
9. User scrolls to explore all panels, thinks "this is cleaner than Census Reporter and I can actually export it"
10. Clicks "Compare" → enters a second ZIP → sees instant side-by-side with color-coded differences
11. **Error state — invalid ZIP:** Input field shows red border (#EF4444), inline message: "That doesn't look like a US ZIP code. Please enter 5 digits." No page navigation occurs. Search bar retains focus.
12. **Error state — API timeout:** Skeleton cards remain visible for 5 seconds, then replaced by: "We're having trouble loading data for this ZIP. Please try again." with a retry button.

### Flow 2: Real Estate Agent Builds a Client Package

1. Agent logs into ZipScope, navigates to `/dashboard` — sees saved reports listed by date
2. Clicks "New Search" in the header → enters the listing's ZIP code
3. ZIP dashboard loads with full demographics + industry breakdown
4. Reviews the data, confirms it matches the area profile they want to present
5. Clicks "Save Report" → report immediately saved and appears in dashboard sidebar
6. Clicks "Export PDF" → loading indicator shows "Generating report..."
7. PDF generates in < 5 seconds: professional one-page layout with header (city, state, ZIP), key stats grid (6 numbers), mini charts (age + education), and footer with data source attribution ("Source: U.S. Census Bureau, ACS 5-Year Estimates")
8. PDF auto-downloads. Agent attaches it to a client email.
9. **Error state — PDF generation fails:** Toast notification (bottom-right, red left-border): "Export failed. Please try again." Retry button in toast. If second attempt fails, offer CSV fallback: "Download as CSV instead?"

### Flow 3: Franchise Developer Compares Territories

1. Franchise developer navigates to `/compare`
2. Sees 2 empty ZIP input fields with placeholder text "ZIP #1" and "ZIP #2"
3. Enters 2 ZIP codes representing candidate franchise territories
4. **System:** Fetches data for both ZIPs in parallel (2 Census calls + 2 Zippopotam calls simultaneously)
5. Comparison view loads: 2 columns, each with identical data rows (population, income, age, education, housing, employment)
6. Difference indicators: green up-arrow badge on the higher value in each row, red down-arrow on the lower. Percentage difference shown (e.g., "+23%")
7. User clicks "Save Comparison" → comparison saved as a single report entity
8. Returns to `/dashboard` later to reference the comparison during a territory review meeting
9. **Error state — one ZIP fails:** Show data for the successful ZIP in its column. Failed column shows: "Data unavailable for [ZIP]. [Retry]" button. Comparison badges are hidden for rows missing data.

---

## 9. Technical Constraints

### Performance Targets
- Landing page initial load: < 1.5 seconds on a 4G connection (target LCP < 1.2s)
- ZIP dashboard render (after search): < 2 seconds total (Zippopotam + Census fetch + render)
- Census API call latency budget: < 1.5 seconds (p95)
- Data USA API call latency budget: < 1 second (p95)
- Comparison view (2 ZIPs): < 2.5 seconds total (parallel fetches)
- PDF export generation: < 5 seconds
- Client-side JavaScript bundle: < 150KB gzipped

### Data Handling: Client-Side vs Server-Side
- **Server-side (Next.js API routes):** Census Bureau API calls (API key must not be exposed to client), PDF generation, user authentication, report save/load from Supabase
- **Client-side:** Zippopotam.us validation (no auth, public), Data USA fetch (no auth, public), chart rendering (Recharts or similar), all UI state management
- **Why:** Census API key protection is the primary driver. Everything else is public and safe to call from the browser.

### Rate Limit Strategy
- **Census Bureau:** Cache all responses server-side for 24 hours, keyed by ZIP + variable set hash. Identical lookups within 24 hours return cached data instantly. Census data updates once per year (September release) — daily cache invalidation is generous.
- **Zippopotam.us:** Cache indefinitely in a server-side Map. ZIP-to-city mappings never change. Pre-warm cache with top 200 US ZIPs on server startup.
- **Data USA:** Cache for 24 hours, same pattern as Census.
- **Nominatim (v2):** Client-side debounce (500ms after last keystroke) + request queue enforcing 1 req/sec maximum. Visual "Searching..." indicator during throttle delay.
- **User-level rate limiting:** Free tier enforces 10 lookups/month via Supabase counter. Anonymous users (no account) get 5 lookups/day tracked by IP hash in server memory (resets daily).

### Persistence
- **User accounts and auth:** Supabase Auth (Google OAuth provider)
- **Saved reports:** Supabase PostgreSQL — schema: `reports(id, user_id, zip_code, city, state, data_snapshot JSONB, created_at, report_type enum('single','comparison'))`
- **Usage tracking:** Supabase PostgreSQL — schema: `usage(user_id, month TEXT, lookup_count INT)` with RLS policies
- **Server-side cache:** In-memory Map for v1 (acceptable because Census data is read-heavy and loss of cache only means re-fetching). Redis in v2 if multiple server instances needed.
- **Client-side:** localStorage for recent searches (last 5 ZIPs) for non-logged-in users only. No core feature depends on localStorage.

---

## 10. v1 vs v2 Scope

### v1 — Build This
- Landing page with centered ZIP search bar, report-focused value proposition, and sample PDF screenshot
- Single ZIP dashboard with 6 data panels: population, median household income, age distribution (bar chart), educational attainment (donut chart), housing (median home value + median rent), employment status
- ZIP validation and city/state enrichment via Zippopotam.us
- Census Bureau ACS 5-Year API integration (~15 demographic variables in one call)
- Compare view for 2 ZIPs side-by-side with difference indicators
- User accounts via Supabase Auth (Google OAuth)
- Save up to 5 reports (free) or 50 reports (Pro)
- PDF export of single ZIP report (one-page professional layout with source attribution)
- Free tier (10 lookups/month) + Pro tier ($19/month)
- 24-hour server-side caching of all API responses
- Mobile-responsive layout (cards stack vertically on small screens)
- Skeleton loading states for all data panels
- Error handling for invalid ZIPs, API failures, and rate limit exhaustion

### v2 — Deferred
- Data USA industry/occupation "Local Economy" panel (requires ZIP-to-county mapping logic)
- City-name search via Nominatim geocoding (v1 is ZIP-only input)
- 3-ZIP comparison (v1 supports 2 only)
- Business tier ($49/mo) with team access, white-label PDFs, and CSV export
- Historical trend charts (compare current ACS data to prior year releases)
- Interactive map with ZCTA boundary polygon overlay
- Embeddable report widget for real estate agent websites
- Email notifications when new ACS data releases for saved ZIPs
- Demographic filter search ("show me all ZIPs where median income > $80K within 20 miles of [location]")
- Comparison report PDF export

**Boundary statement:** v1 ships when a user can enter any valid US ZIP code, see accurate Census demographics in under 3 seconds, compare 2 ZIPs side-by-side with difference badges, save reports to an account, and export a professional single-ZIP PDF. The product succeeds when professionals use ZipScope as their report output tool rather than manually assembling Census data. v2 begins when 50+ users have saved at least one report, validating that the output-first positioning creates enough value for retention.
