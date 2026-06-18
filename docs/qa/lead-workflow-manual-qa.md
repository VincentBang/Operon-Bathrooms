# Operon Bathrooms Lead Workflow Manual QA

Status: local smoke passed for public-to-admin structure; production database persistence remains
unverified without local/staging Supabase credentials.

Last local QA run: 2026-06-17.

## Local QA Result Summary

- Public lead routes checked: `/quote`, `/quote/review`, `/request-review`, `/site-measure`.
- Admin route checked: `/admin/leads` exists and is token guarded. Without `OPERON_BATHROOMS_ADMIN_TOKEN`,
  admin APIs return a safe `503` instead of exposing lead data.
- Supabase persistence checked in local safe mode only; without server Supabase env vars, submissions use
  safe local fallback files where implemented and do not require production settings.
- Responsive smoke checked at 1440px, 1280px, 768px and 390px for `/`, `/quote`, `/quote/review`, `/request-review` and `/site-measure`; no horizontal overflow found.
- Public copy smoke checked for planning-guidance language and obvious over-promising phrases; no fixed-price guarantee or guaranteed-compliance wording found in the checked pages.
- Public bundle smoke checked for service-role and private rate-card markers; no matches found in static output during QA.

## API Smoke Results

- Standard estimate: `/api/estimate` returned `200` with a planning range, confidence score and risk flags.
- High-risk apartment estimate: `/api/estimate` returned `200`, low confidence and multiple risk flags.
- Estimate lead submission: `/api/leads` returned safe local no-storage behavior when Supabase server env vars were absent.
- Quote review submission: `/api/quote-review` returned `200` with clarity scoring, risk flags, upload metadata placeholder handling and attribution.
- Request review submission: `/api/request-review` returned `200` with attribution and safe local no-storage behavior.
- Site measure submission: `/api/site-measure` returned `200` with attribution and safe local no-storage behavior.

## Current Blockers

- No local or staging Supabase credentials were configured for this QA run, so database persistence was not verified.
- Upload storage is intentionally placeholder-safe only; uploaded files are not publicly exposed, but secure private storage was not configured or tested.
- Email delivery env vars were not configured; notification payload preparation is tested without sending provider email.

## Scope

This checklist covers public lead capture for:

- Planning estimate users
- Existing quote review users
- Request review users
- Site measure users

It also documents the admin workflow that must be tested once `/admin/leads` exists.

## Required local environment

- `NEXT_PUBLIC_SITE_URL`: optional for local canonical/sitemap behavior.
- `NEXT_PUBLIC_SUPABASE_URL`: required only for Supabase-backed local/staging storage.
- `SUPABASE_SERVICE_ROLE_KEY`: required only for server-side local/staging lead writes.
- Email env vars: not currently used.

If Supabase env vars are absent, API routes validate and return safe responses with `stored: false`.
Do not treat that as database persistence.

## Test URL UTM Parameters

Use this suffix for manual public submissions:

```text
?utm_source=manualqa&utm_medium=test&utm_campaign=bathroom_admin_qa&utm_content=estimate_flow&utm_term=quote_review
```

## Test Lead 1: Standard Estimate Lead

Input:
- House
- Main bathroom / full bathroom
- Same layout
- Mid-range finish
- No known asbestos
- No strata
- No major service relocation

Expected public result:
- Planning estimate range generated
- Medium/high confidence
- Limited risk flags
- Recommended next step visible
- CTAs visible: quote review, site measure, scope review

Expected admin result once admin exists:
- Lead type: estimate
- Confidence score visible
- Attribution visible
- Status and internal notes updateable

## Test Lead 2: High-Risk Apartment Estimate

Input:
- Apartment / strata
- Older building
- Suspected asbestos
- Plumbing relocation
- Waterproofing uncertainty
- Access/lift constraint

Expected public result:
- Lower confidence
- High-risk flags visible
- Site measure/manual review recommended

Expected admin result once admin exists:
- Strata/asbestos/plumbing/waterproofing risks visible
- Attribution visible
- Status and notes updateable

## Test Lead 3: Quote Review With Risk

Input:
- Quote amount above likely HBC/HBCF threshold
- GST unclear
- Deposit over 10%
- Waterproofing unclear
- No certificate mention
- PC sums unclear
- Exclusions unclear
- Builder licence missing

Expected public result:
- Quote clarity score reduced
- Missing inclusions listed
- Allowance risk visible
- Questions to ask builder generated
- Wording uses clarify/confirm language only

Expected admin result once admin exists:
- Lead type: quote_review
- Clarity score visible
- Risk flags, missing inclusions and attribution visible

## Test Lead 4: Request Review

Input:
- Has photos/plans
- No builder quote yet
- Wants scope review

Expected public result:
- Confirmation state visible
- Reminder that this is not contract pricing

Expected admin result once admin exists:
- Lead type: request_review
- Message, stage, budget and preferred next step visible

## Test Lead 5: Site Measure Request

Input:
- Ready for inspection
- Address/access notes
- Strata status
- Known issue

Expected public result:
- Confirmation state visible
- Site measure checklist visible
- Reminder that contract pricing requires site inspection, selections, licensed trade checks and written scope confirmation

Expected admin result once admin exists:
- Lead type: site_measure
- Access notes, preferred time and known issues visible

## Public Workflow Checks

- Form loads.
- Required fields validate.
- Optional fields do not block submission.
- Honeypot blocks spam safely.
- Consent checkboxes are required.
- Submission success state appears.
- Error state is understandable.
- No final-quote wording appears.
- No legal advice is given.
- No internal rates, supplier costs, labour rates, margins, admin notes or private scoring logic appears.
- Mobile layout works at 390px without horizontal overflow.
- CTA links work.
- Attribution fields are captured.

## Admin Workflow Checks

Unauthorised:
- `/admin/leads` blocks access without token.
- No lead data visible.
- No service-role errors leak.

Authorised:
- Lead list loads.
- Summary counts are correct.
- Filters work: lead type, status, risk level, suburb, date range, source/UTM, search.
- Detail view shows contact, project summary, payload, risk flags, confidence or clarity score, recommended next step and attribution.
- Uploaded file metadata is visible only if secure handling exists.
- Internal notes are admin-only.

Status transitions:
- new -> reviewed
- reviewed -> contacted
- contacted -> site_measure_requested
- site_measure_requested -> site_measure_booked
- reviewed -> qualified
- reviewed -> not_fit
- qualified -> won
- qualified -> lost
- any lead -> archived

Internal notes:
- Add note.
- Edit note.
- Refresh and confirm persistence.
- Confirm note does not appear publicly.
- Confirm HTML/script is escaped or rejected.

## Security Checks

- Admin pages noindex,nofollow once present.
- Admin routes not in sitemap, nav or footer.
- No service role key in client bundle.
- No anon SELECT for lead/admin data.
- Internal notes never appear outside admin.
- Upload paths are not public.
- Public estimate output does not expose private rate-card logic.
