# Phase 1 MVP Report

## Scope completed

- Created a standalone Next.js app in `operon-bathrooms`.
- Added static SEO pages for home, quote, Sydney cost guide, service pages, how it works, privacy
  and terms.
- Implemented the multi-step planning estimate wizard with client-side validation.
- Added a server-side estimate API backed by a private local rate card.
- Added PDF download generation using `pdf-lib`.
- Added Supabase client insertion helper and a draft `bathroom_estimates` migration.
- Kept public outputs to planning ranges, confidence score, assumptions, exclusions, risk flags and
  compliance prompts.

## Success criteria

- Internal rates and adjustments are not returned by the estimate API.
- Public copy states the estimate is planning guidance only and not a final quote or legal advice.
- NSW compliance prompts are present for licence, deposit and HBCF considerations.
- Local tests cover estimate calculation, validation and basic page rendering.

## Verification

Executed locally:

```bash
npm install
npm run test       # 6 tests passed
npm run lint       # passed
npm run typecheck  # passed
npm run build      # passed
```

Additional privacy check:

```bash
rg "18500|26500|36500|lowMultiplier|layoutMoveWetArea|premiumFixtures" .next/static app components lib tests README.md REPORT.md -n
```

This found no private numeric rates in `.next/static`; matches were limited to server/test source
references.

No deployment, push, production Supabase changes or production Netlify changes are part of this MVP.
