# Live SEO Zero-Warning Crawl Evidence - 2026-07-10

## Scope

- Site checked: `https://operonbathrooms.netlify.app`
- Deploy commit checked: `d0334f7229e2d2791259c86503baa3fb5f144a93`
- Routes checked: 30 public routes
- Purpose: confirm the previous long-title and `/quote` meta-description warning list has been resolved.

## Commands Run

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run qa:bundle-safety
git diff --check
npm run qa:public-safety -- http://127.0.0.1:3000
npm run qa:public-safety -- https://operonbathrooms.netlify.app
```

Additional live metadata crawl checks were run against the Netlify site for:

- HTTP 200 status
- title presence and length
- meta description presence and length
- one H1
- canonical presence
- Open Graph title and description
- FAQPage schema on guide pages
- sitemap coverage using canonical URLs
- robots admin disallow
- no admin/API sitemap exposure
- no forbidden final-quote, legal-advice, private-pricing or internal-marker wording

## Result

Status: `PASSED`

- Warning count: `0`
- Failure count: `0`
- Public safety crawl: `PASSED`
- Sitemap check: `PASSED`
- Robots admin disallow: `PASSED`
- Forbidden wording scan: `PASSED`

## Metadata Warning Fixes Confirmed

The live crawl confirmed the warning-list pages now render below threshold:

| Route | Live title length | Live description length |
| --- | ---: | ---: |
| `/bathroom-quote-sydney` | 40 | 157 |
| `/bathroom-renovation-cost-sydney` | 50 | 167 |
| `/guides/apartment-bathroom-strata-review` | 50 | 126 |
| `/guides/bathroom-pc-sums-provisional-sums` | 51 | 106 |
| `/guides/bathroom-quote-checklist` | 43 | 136 |
| `/guides/home-building-compensation-insurance-bathrooms` | 49 | 123 |
| `/guides/waterproofing-and-bathroom-quotes` | 52 | 138 |
| `/quote` | 60 | 128 |
| `/quote/review` | 40 | 158 |
| `/services/apartment-bathroom-renovation-sydney` | 55 | 154 |
| `/services/bathroom-refresh` | 42 | 141 |
| `/services/ensuite-renovation` | 44 | 144 |
| `/services/laundry-bathroom-renovation` | 46 | 136 |
| `/services/small-bathroom-renovation` | 51 | 120 |
| `/site-measure` | 47 | 133 |

## Notes

- The live site serves canonical URLs on `https://www.operonbathrooms.com.au`, while this crawl was performed through the Netlify deploy host.
- Sitemap coverage was therefore validated against each page's canonical URL, not the Netlify host URL.
- No deployment settings, production Supabase settings, production Netlify settings, or non-Bathrooms repos were modified.
