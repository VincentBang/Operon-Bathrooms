# Operon Bathrooms Lead Workflow Manual QA

Status: local automated smoke passed for public-to-admin structure; production database persistence
remains unverified without approved local/staging Supabase credentials.

Last local QA run: 2026-06-19.

## Local QA Result Summary

- Public lead routes checked: `/quote`, `/quote/review`, `/request-review`, `/site-measure`.
- Admin route checked: `/admin/leads` exists, is noindex/nofollow and admin APIs reject unauthenticated
  access instead of exposing lead data.
- Supabase persistence checked in local safe mode only; without server Supabase env vars, submissions use
  safe local fallback files where implemented and do not require production settings.
- Public route crawl passed for titles, one H1, canonicals and obvious forbidden wording.
- Public safety crawl passed for admin links, sitemap/robots exclusions, planning-only conversion copy and
  private-pricing leak patterns.
- Client bundle safety scan passed for service-role markers, private-pricing markers, internal notes,
  manual report internals and private qualification markers.
- Public API response tests passed for quote review, request review, site measure and chatbot handoff.
- Authorised admin workflow tests passed for lead list filtering, manual-review queue reads, bulk qualification,
  response template generation, manual review report preview/persist/update, qualification override and chatbot
  follow-up reads using the safe local fallback store.
- Responsive QA passed through the local headless Chrome CDP harness for `/`, `/quote`, `/quote/review`,
  `/request-review`, `/site-measure` and `/admin/leads` at 1440px, 1280px, 768px and 390px.
- Responsive screenshots are generated locally in `.local/qa-responsive` and are intentionally ignored by git.

## API Smoke Results

- Standard estimate: `/api/estimate` returned `200` with a planning range, confidence score and risk flags.
- High-risk apartment estimate: `/api/estimate` returned `200`, low confidence and multiple risk flags.
- Estimate lead submission: `/api/leads` returned safe local no-storage behavior when Supabase server env vars were absent.
- Quote review submission: `/api/quote-review` returned `200` with clarity scoring, risk flags, upload metadata placeholder handling and attribution.
- Request review submission: `/api/request-review` returned `200` with attribution and safe local no-storage behavior.
- Site measure submission: `/api/site-measure` returned `200` with attribution and safe local no-storage behavior.
- Chatbot handoff submission: `/api/chatbot-qualification` returned `200` with a safe public confirmation
  and no private qualification internals.
- Authorised admin workflow test: local fallback lead data returned only after the configured admin token,
  response copy stayed planning-only, manual review report internals stayed behind admin APIs, and chatbot
  qualification/follow-up records were readable only through the admin endpoint.

## Current Blockers

- No local or staging Supabase credentials were configured for this QA run, so database persistence was not verified.
- Upload storage is intentionally placeholder-safe only; uploaded files are not publicly exposed, but secure private storage was not configured or tested.
- Email delivery env vars were not configured; notification payload preparation is tested without sending provider email.
- A final human visual review is still recommended before merge, but the local automated viewport checks
  now cover H1 presence, horizontal overflow, chatbot/admin visibility and launcher overlap.

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
- Local automated coverage now confirms authorised reads for lead list filtering, manual-review view,
  response templates, manual review report generation/update, qualification overrides, chatbot qualifications
  and open follow-up tasks.

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
- Run `npm run qa:public-safety -- http://127.0.0.1:3000` against a clean local dev server before merge.
