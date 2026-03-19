# Design Notes — ZipScope

## Design System Applied
- Color tokens: ✅ all 10 match spec exactly (#0D9488, #F8FAFC, #FFFFFF, #E2E8F0, #0F172A, #64748B, #14B8A6, #10B981, #EF4444, #F59E0B)
- Typography: ✅ DM Sans headings, Inter body, base body size set to 15px/1.6 line-height per spec
- Spacing: ✅ 4px base unit, Tailwind default scale matches spec
- Border radii: ✅ sm(4px), md(8px), lg(12px), full(9999px)
- Animations: ✅ fast(120ms), normal(200ms), slow(350ms), all ease-out

## Changes Made

### Foundation
1. **tailwind.config.ts** — Added `fontSize.body` (15px/1.6), `transitionTimingFunction` (ease-out default), keyframes (`slide-in`, `fade-in-up`, `fade-in`), animation utilities
2. **src/app/globals.css** — Set base body font-size 15px with 1.6 line-height, added `.stagger-grid` utility for staggered card entrance animations

### UI Components
3. **src/components/ui/Button.tsx** — Added `active:scale-[0.98]` press feedback, `focus-visible` ring with primary/30 color, changed `transition-colors` to `transition-all`
4. **src/components/ui/SearchBar.tsx** — Added `transition-all` to input and `active:scale-[0.98]` to submit button
5. **src/components/ui/Toast.tsx** — Added `role="alert"` for accessibility, transition on dismiss button hover
6. **src/components/ui/ErrorCard.tsx** — Added `animate-fade-in` entrance animation
7. **src/components/ui/SkeletonCard.tsx** — Softened skeleton pulse bars to `border/60` opacity for subtler loading state

### Layout
8. **src/components/layout/Header.tsx** — Added hover opacity to logo, increased nav gap to 16px, added `duration-fast` to nav link transitions
9. **src/components/layout/Footer.tsx** — Added `bg-bg` background, increased vertical padding to 32px for breathing room

### Landing Page
10. **src/components/features/landing/HeroSection.tsx** — Staggered `animate-fade-in-up` on h1, subtitle, search bar, and caption (60ms increments), increased vertical padding to py-24 and bottom spacing
11. **src/components/features/landing/FeatureGrid.tsx** — Feature items now have card styling (`bg-surface rounded-lg p-6`), hover shadow lift (`hover:shadow-md hover:-translate-y-0.5`), stagger grid animation
12. **src/components/features/landing/SamplePDFPreview.tsx** — Upgraded from `shadow-sm` to `shadow-md`, added `animate-fade-in-up` entrance and `hover:shadow-lg` interaction

### Dashboard Cards
13. **src/components/features/dashboard/DashboardShell.tsx** — Added `stagger-grid` class to 6-panel grid for staggered entrance animation
14. **src/components/features/dashboard/PopulationCard.tsx** — Added `transition-shadow duration-normal hover:shadow-md`
15. **src/components/features/dashboard/IncomeCard.tsx** — Same hover shadow treatment
16. **src/components/features/dashboard/HousingCard.tsx** — Same hover shadow treatment
17. **src/components/features/dashboard/EmploymentCard.tsx** — Same hover shadow treatment
18. **src/components/features/dashboard/AgeChart.tsx** — Same hover shadow treatment
19. **src/components/features/dashboard/EducationChart.tsx** — Same hover shadow treatment

### Compare Page
20. **src/components/features/compare/CompareRow.tsx** — Added `hover:bg-bg/50` row highlight on hover
21. **src/components/features/compare/CompareTable.tsx** — Added `animate-fade-in-up` entrance animation
22. **src/components/features/compare/CompareInput.tsx** — Added `transition-all duration-fast` to both ZIP inputs

### Reports
23. **src/components/features/reports/ReportCard.tsx** — Added `hover:shadow-sm` card hover, `duration-fast` on link transition

### Pricing
24. **src/app/pricing/page.tsx** — Added `hover:shadow-md hover:-translate-y-0.5` to all plan cards, "Most Popular" badge on Pro plan, `active:scale-[0.98]` on CTA buttons

### Settings
25. **src/app/settings/page.tsx** — Added `animate-fade-in-up` to settings card, transition on upgrade link

## Responsive Status
| Page | Desktop | Mobile (390px) |
|------|---------|----------------|
| `/` | ✅ | ✅ Hero stacks, search bar responsive, features stack vertically |
| `/search/[zip]` | ✅ | ✅ Cards stack to single column, buttons wrap on sm |
| `/compare` | ✅ | ✅ Inputs stack vertically via sm:flex-row, table uses grid proportional layout |
| `/dashboard` | ✅ | ✅ Single column layout, buttons responsive |
| `/reports/[id]` | ✅ | ✅ Same as search dashboard |
| `/pricing` | ✅ | ✅ Plans stack to single column on mobile |
| `/settings` | ✅ | ✅ Max-width 2xl, form content stacks naturally |

## Microinteractions Added
- **Page load (Hero):** Staggered fade-in-up animation (h1 → subtitle → search → caption, 60ms increments)
- **Page load (Dashboard):** 6 cards enter with staggered fade-in-up (60ms increments via `.stagger-grid`)
- **Page load (Features):** 3 feature cards animate in with stagger
- **Hover states:** All cards (dashboard, feature, pricing, report) lift with shadow on hover. Compare rows highlight with subtle bg. All buttons respond with color change.
- **Press feedback:** All buttons scale down to 0.98 on active/click
- **Focus states:** All buttons have focus-visible ring (primary/30 with offset)
- **Toast entrance:** Slide-in animation from right (200ms ease-out)
- **Error cards:** Fade-in entrance animation
- **Compare table:** Fade-in-up entrance when results load
- **Settings card:** Fade-in-up entrance on page load
- **PDF preview:** Hover shadow lift effect

## Build Status
- After design pass: ✅ PASS
