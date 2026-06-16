# Operon Bathrooms

Phase 1 MVP for a standalone Operon Bathrooms planning estimate wizard and SEO site.

## Local setup

```bash
cd operon-bathrooms
npm install
npm run dev
```

Optional local environment:

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only for a non-production
Supabase project. Do not use production Operon Flooring, Oz Timber Floor, Operon Kitchens, Netlify
or Supabase settings.

## Scripts

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Private estimate data

The MVP rate card is stored at `data/private/bathroom-rate-card.json` and imported only by server
calculation code. Public API responses expose only planning ranges, confidence scores, assumptions,
exclusions, risk flags and compliance prompts.

## Supabase

The draft migration is in `supabase/migrations/202606170001_create_bathroom_estimates.sql`.
Apply it only to a new bathroom-specific development project after review.

## Public disclaimer

All estimate copy must remain clear that outputs are planning guidance only, not final quotes,
contracts, building advice or legal advice. NSW prompts mention licence checks over $5k, deposits
generally limited to 10%, and HBCF cover generally required over $20k.
