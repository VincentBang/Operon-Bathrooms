# Operon Bathrooms Release Hardening QA Evidence - 2026-06-28

Status: PASSED_LOCAL_QA

This report captures the local-only release-hardening QA pass for Operon Bathrooms after the separate planning lane
was merged. It is evidence only. It does not deploy, modify production Supabase, modify production Netlify, unlock
private upload storage, unlock Quote OS or change Design Studio Phase 7 status.

## Scope

Validated locally:

- Public route crawl and metadata.
- Public safety copy and admin-link boundary.
- Responsive route checks at desktop, laptop, tablet and mobile widths.
- Admin route chatbot exclusion.
- Local lint, typecheck, test, build, migration and bundle-safety gates.
- Email staging contract in preview mode.

Not run:

- Real staging email send. Approved provider environment variables and explicit send approval were not supplied.
- Live local/staging Supabase verification. No approved non-production Supabase target was configured in this run.
- Human screen-reader review. This pass used automated/local QA only.
- Deployment or production release checks.

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `npm run qa:local` | Passed | Includes lint, typecheck, tests, build, migration verification and bundle safety. |
| `npm run qa:crawl -- http://127.0.0.1:3000` | Passed | 17 public routes returned 200 with title, one H1 and canonical. |
| `npm run qa:public-safety -- http://127.0.0.1:3000` | Passed | Public routes, sitemap, robots and copy safety stayed inside public boundary. |
| `npm run qa:responsive -- http://127.0.0.1:3000` | Passed | 6 routes checked at 1440px, 1280px, 768px and 390px. |
| `npm run qa:email:staging` | Passed | Preview and provider-failure contracts passed. Real send remains opt-in. |

## Local Gate Details

`npm run qa:local` passed:

- ESLint completed.
- TypeScript completed.
- Test suite passed: 76 tests.
- Next.js production build completed.
- Supabase migration safety verification passed.
- Client bundle safety scan passed.

Expected warnings:

- Next.js reported the existing ESLint plugin warning.
- Bundle safety reported admin terminology in the protected admin client chunk only. The scan fails on secret or
  private-pricing implementation markers; none were found.

## Public Crawl Evidence

The public crawl passed for:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/bathroom-renovation-cost-sydney`
- `/bathroom-quote-sydney`
- `/services/full-bathroom-renovation`
- `/services/apartment-bathroom-renovation-sydney`
- `/services/ensuite-renovation`
- `/services/small-bathroom-renovation`
- `/services/bathroom-refresh`
- `/services/laundry-bathroom-renovation`
- `/how-it-works`
- `/faq`
- `/privacy`
- `/terms`

Result:

- All returned 200.
- All had title metadata.
- All had one H1.
- All had canonical metadata.
- No obvious forbidden wording was reported.

## Public Safety Evidence

The public safety scan passed for public routes, sitemap and robots.

Confirmed:

- Public pages did not expose admin links.
- Public checks stayed inside the approved boundary.
- No private rates, margins, internal scoring, admin notes or manual-review report content was reported.
- Public language remained planning guidance rather than final quote language.

## Responsive Evidence

`npm run qa:responsive -- http://127.0.0.1:3000` passed for:

- Desktop: 1440px.
- Laptop: 1280px.
- Tablet: 768px.
- Mobile: 390px.

Routes checked:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/admin/leads`

Confirmed:

- One H1 on each checked route.
- No horizontal overflow on each checked route.
- Chatbot visible on public routes.
- Chatbot hidden on `/admin/leads`.
- Responsive screenshots were generated locally under `.local/qa-responsive` and were not committed.

## Email Contract Evidence

`npm run qa:email:staging` passed in local preview mode.

Confirmed:

- Preview payload contract passed.
- Provider failure contract passed.
- Secrets were not printed.
- Real email send remains opt-in and was not run.

## Admin And Private Boundary Evidence

Covered by the local test suite and browser-facing checks:

- Admin page metadata remains noindex/nofollow.
- Admin APIs reject unauthenticated requests.
- Public routes did not include admin links.
- Chatbot is hidden on `/admin/leads`.
- Protected admin client chunk may contain admin labels, but bundle safety found no secret or private-pricing markers.

## Known Limitations

- This was not a production deployment test.
- This was not a live Supabase staging verification.
- This was not a real staging email send.
- This was not a human screen-reader pass.
- Local screenshots were generated but intentionally not committed.

## Boundary Confirmation

- No deployment was performed.
- No push to production settings was performed.
- No production Supabase changes were performed.
- No production Netlify changes were performed.
- No private upload storage was implemented or unlocked.
- No Quote OS work was implemented or unlocked.
- No Design Studio Phase 7 implementation was performed or unlocked.
- No Operon Flooring, Operon Kitchens or Oz Timber Floor repositories were touched.

## Recommended Next Task

Review and approve this QA evidence PR. After merge, the next safe separate task is a staging-readiness decision:
either provide approved non-production Supabase and email provider environment variables for live staging verification,
or keep staging integrations paused and create a docs-only release decision packet from the local evidence above.

