# Live SEO Crawl Evidence - 2026-07-10

Status: PASSED_WITH_WARNINGS

Target: `https://operonbathrooms.netlify.app`

Purpose: verify the live public SEO surface after Phase 2 authority-guide expansion. This crawl
checked sitemap URLs, route availability, metadata, canonical tags, H1 counts, FAQ schema, internal
links and forbidden public wording.

## Summary

| Check | Result |
| --- | --- |
| Sitemap fetched | Passed |
| Sitemap URLs crawled | 30 |
| Public routes returning 200 | 30 |
| Admin/API/internal routes in sitemap | None found |
| `robots.txt` disallows `/admin` | Passed |
| `robots.txt` disallows `/api` | Passed |
| Title tag present | 30/30 |
| Meta description present | 30/30 |
| Canonical tag present | 30/30 |
| One H1 per page | 30/30 |
| Guide FAQ schema present | 10/10 guide pages |
| Internal link probes | No broken internal links found |
| Forbidden public wording | No blocking matches found |

Blocking failures: 0

Warnings: 15 title/meta length warnings. See the warning list below.

## Routes Crawled

| Route | Status | Metadata | H1 | FAQ Schema | Broken Internal Links |
| --- | --- | --- | --- | --- | --- |
| `/` | 200 | Passed | 1 | No | 0 |
| `/areas` | 200 | Passed | 1 | No | 0 |
| `/bathroom-quote-sydney` | 200 | Passed | 1 | No | 0 |
| `/bathroom-renovation-cost-sydney` | 200 | Passed | 1 | No | 0 |
| `/faq` | 200 | Passed | 1 | No | 0 |
| `/guides` | 200 | Passed | 1 | No | 0 |
| `/guides/apartment-bathroom-strata-review` | 200 | Passed | 1 | Yes | 0 |
| `/guides/bathroom-compliance-nsw` | 200 | Passed | 1 | Yes | 0 |
| `/guides/bathroom-deposit-limit-nsw` | 200 | Passed | 1 | Yes | 0 |
| `/guides/bathroom-pc-sums-provisional-sums` | 200 | Passed | 1 | Yes | 0 |
| `/guides/bathroom-quote-checklist` | 200 | Passed | 1 | Yes | 0 |
| `/guides/bathroom-quote-vs-estimate` | 200 | Passed | 1 | Yes | 0 |
| `/guides/bathroom-renovation-licence-nsw` | 200 | Passed | 1 | Yes | 0 |
| `/guides/home-building-compensation-insurance-bathrooms` | 200 | Passed | 1 | Yes | 0 |
| `/guides/site-measure-checklist` | 200 | Passed | 1 | Yes | 0 |
| `/guides/waterproofing-and-bathroom-quotes` | 200 | Passed | 1 | Yes | 0 |
| `/how-it-works` | 200 | Passed | 1 | No | 0 |
| `/privacy` | 200 | Passed | 1 | No | 0 |
| `/product-schedule` | 200 | Passed | 1 | No | 0 |
| `/quote` | 200 | Passed | 1 | No | 0 |
| `/quote/review` | 200 | Passed | 1 | No | 0 |
| `/request-review` | 200 | Passed | 1 | No | 0 |
| `/services/apartment-bathroom-renovation-sydney` | 200 | Passed | 1 | No | 0 |
| `/services/bathroom-refresh` | 200 | Passed | 1 | No | 0 |
| `/services/ensuite-renovation` | 200 | Passed | 1 | No | 0 |
| `/services/full-bathroom-renovation` | 200 | Passed | 1 | No | 0 |
| `/services/laundry-bathroom-renovation` | 200 | Passed | 1 | No | 0 |
| `/services/small-bathroom-renovation` | 200 | Passed | 1 | No | 0 |
| `/site-measure` | 200 | Passed | 1 | No | 0 |
| `/terms` | 200 | Passed | 1 | No | 0 |

## Safety Checks

The crawl checked rendered public page text for:

- final quote online promises
- fixed-price guarantee language
- legal-advice claims
- guaranteed compliance claims
- cheap-renovation acquisition positioning
- DIY waterproofing positioning
- emergency repair positioning
- supply-only positioning
- private pricing markers, including supplier costs, labour rates, margin logic, rate cards, service-role keys and lead scoring

No blocking matches were found.

## Warnings

These are not release blockers, but they are useful metadata-polish targets:

- `/bathroom-quote-sydney`: long title, 77 characters.
- `/bathroom-renovation-cost-sydney`: long title, 86 characters.
- `/guides/apartment-bathroom-strata-review`: long title, 75 characters.
- `/guides/bathroom-pc-sums-provisional-sums`: long title, 72 characters.
- `/guides/bathroom-quote-checklist`: long title, 72 characters.
- `/guides/home-building-compensation-insurance-bathrooms`: long title, 71 characters.
- `/guides/waterproofing-and-bathroom-quotes`: long title, 73 characters.
- `/quote`: long meta description, 182 characters.
- `/quote/review`: long title, 87 characters.
- `/services/apartment-bathroom-renovation-sydney`: long title, 79 characters.
- `/services/bathroom-refresh`: long title, 75 characters.
- `/services/ensuite-renovation`: long title, 83 characters.
- `/services/laundry-bathroom-renovation`: long title, 73 characters.
- `/services/small-bathroom-renovation`: long title, 71 characters.
- `/site-measure`: long title, 75 characters.

## Boundary Confirmation

- No admin route appeared in the sitemap.
- No API route appeared in the sitemap.
- No debug/internal route appeared in the sitemap.
- Public pages did not expose admin links during the crawl.
- Public pages did not expose private rates, margins, supplier costs, service-role keys or lead scoring.
- Public pages stayed within planning-guidance positioning.

## Recommended Next Task

Polish title tags and the `/quote` meta description for the warning list above, then rerun this
live crawl to confirm zero warnings.

