# Critic Review — ZipScope

## Score Summary
| Dimension        | Score | Notes |
|-----------------|-------|-------|
| Market          | 7/10  | Strong real estate + franchise personas; salon owner is weak |
| Differentiation | 5/10  | Census Reporter does 80% of this for free — spec ignores it entirely |
| Product Flow    | 8/10  | 2 actions to value, no signup wall, clean error states |
| Technical       | 8/10  | All 4 APIs verified in catalog, caching strategy is sound |
| Design          | 7/10  | Teal-on-light is intentional and audience-appropriate |
| **TOTAL**       | **35/50** | |

## Detailed Findings

### Market (7/10)

Two of three personas are genuine subscription buyers. Derek the real estate agent creates client packages regularly (15-20/year) and would pay $19/mo to replace 2 hours of manual census.gov data pulls. Priya the franchise developer compares 5-10 ZIPs per week — recurring, high-frequency use on a company expense card. Both have clear willingness to pay.

Maria the salon owner is the weak link. She needs location demographics 1-3 times total while scouting her second location. She would pay for one month, get her answer, and cancel. Monthly subscription does not fit a one-time research task. The spec presents her as the lead persona but she's the worst fit.

Distribution channel: SEO for "demographics by zip code" and "neighborhood analysis" is real but competitive. Real estate agent communities (Facebook groups, brokerage newsletters) are identifiable. Price point is realistic for professional tooling.

### Differentiation (5/10)

This is the critical weakness. The spec names only two alternatives: census.gov ("a UX nightmare") and Esri ("$5,000+/year"). It completely ignores the middle of the market:

- **Census Reporter** (censusreporter.org) — free, well-designed, enter any geography, see demographics with charts and comparisons to parent geographies. It does 80% of what ZipScope v1 proposes to do, for $0.
- **Social Explorer** — academic/professional census data visualization, generous free tier.
- **PolicyMap** — neighborhood-level data overlays, used by community development orgs.
- **Data.census.gov** itself has improved significantly and now offers profile pages for ZCTAs.

The spec's value proposition collapses if the user Googles "78701 demographics" and finds Census Reporter on the first page. The comparison view and PDF export are genuine differentiators — but the spec buries them as secondary features rather than making them the core selling point.

No portfolio duplicate — no existing Foundry product uses Census data or targets real estate/location analysis.

### Product Flow (8/10)

Onboarding steps to value: **2** (type ZIP, see dashboard). No signup required. This is excellent.

The flow is well-designed: large search bar, instant redirect, skeleton loading, staggered card animation. Error states are thorough — invalid ZIP, API timeout, and one-of-two-fails in comparison mode all have specific handling.

The free → paid gate is well-placed (save report / export PDF), giving users full data access before asking for money. Compare flow is clean and intuitive.

One minor issue: Flow 2 step 7 mentions "Export PDF" generating in < 3 seconds, but Section 9 sets the target at < 5 seconds. Inconsistent.

### Technical Feasibility (8/10)

All APIs verified against API-CATALOG.md:

| Spec API | Catalog Entry | Auth Match | Rate Limit Match | Status |
|----------|--------------|------------|------------------|--------|
| US Census Bureau | ✅ `https://api.census.gov/data` | ✅ API Key, free | ✅ Free | VERIFIED |
| Data USA | ✅ `https://datausa.io/api/data` | ✅ None | ✅ Unknown | VERIFIED (deferred to v2) |
| Zippopotam.us | ✅ `https://api.zippopotam.us` | ✅ None | ✅ Unknown | VERIFIED |
| Nominatim | ✅ `https://nominatim.openstreetmap.org` | ✅ None | ✅ 1 req/sec | VERIFIED (deferred to v2) |

The spec claims Census API is "effectively unlimited for registered API keys." The catalog entry says only "Free" without specifying limits. Census Bureau documentation does support this claim, but it's worth noting the catalog doesn't explicitly confirm it. Not docking for this — it's a well-known fact.

Caching strategy is excellent: 24-hour cache for annually-updated data, indefinite cache for static ZIP-to-city mappings, pre-warming top 200 ZIPs. Server-side Census calls to protect API key. Client-side calls for auth-free APIs. All technically sound.

### Design Coherence (7/10)

The palette is intentional and justified. Teal (#0D9488) communicates trust and data credibility — appropriate for a demographics tool used by professionals. Light mode only is the right call for this audience (office workers, daytime use). The spec explicitly explains why, which is more thought than most specs put in.

DM Sans headings + Inter body is a reasonable pairing. The spec explains the choice (DM Sans is friendlier for non-technical users). Spacing scale and border radius values are consistent.

The one concern: these are essentially Tailwind's teal-600 and slate-50 defaults with articulate reasoning wrapped around them. The design would look clean and professional but wouldn't be distinctive. A real estate agent would not remember the brand aesthetics. Functional, not memorable.

## Issues to Address

1. **Acknowledge Census Reporter and explain why ZipScope wins.** This is non-negotiable. The spec cannot pretend the most obvious free competitor doesn't exist. State what Census Reporter lacks (PDF export, side-by-side comparison with percentage badges, saved reports, professional presentation layer) and position ZipScope as the "output tool" that Census Reporter is not.

2. **Reposition the core value prop from "look up demographics" to "build professional demographic reports."** The lookup is free everywhere. The report — PDF-ready, comparison-enabled, saveable, brandable — is what people will pay for. The tagline should reflect this.

3. **Drop or demote the salon owner persona.** Maria is not a subscription customer. She's a one-time user who will churn after month 1. Lead with Derek (recurring professional use) and Priya (weekly high-frequency use). If Maria stays, reframe her as a free-tier user who demonstrates viral discovery, not a revenue persona.

4. **Fix the PDF generation time inconsistency.** Flow 2 says < 3 seconds, Section 9 says < 5 seconds. Pick one.

5. **Add a competitive landscape section.** Name Census Reporter, Social Explorer, PolicyMap, and Esri by name. Position ZipScope against each. This forces honest differentiation thinking and strengthens the spec.

## Verdict Rationale

The spec is exceptionally well-written — the technical plan is sound, all APIs are verified, the flows are thorough with proper error handling, and the design choices are justified. The problem is competitive positioning, not execution quality. Census Reporter is a free, well-designed tool that does most of what ZipScope v1 offers, and the spec pretends it doesn't exist. The real differentiator (professional PDF reports, branded exports, saved comparisons) is buried as a secondary feature rather than being the core pitch. A rewrite that repositions ZipScope as a "demographic report builder for real estate professionals" rather than a generic "neighborhood intelligence" tool — and honestly addresses the free competition — would push Differentiation above 6 and make this a PROCEED. The bones are strong; the positioning needs surgery.

VERDICT: REWRITE