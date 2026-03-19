# ZipScope

Turn Census data into client-ready demographic reports in 15 seconds.

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your keys in `.env.local`:
   - `CENSUS_API_KEY` — free at [census.gov](https://api.census.gov/data/key_signup.html)
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — from your [Supabase](https://supabase.com) project

3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Spec

See [PROJECT-1773902365-SPEC.md](./PROJECT-1773902365-SPEC.md) for the full product specification.
