# Operon Bathrooms Execution Log

This log records local implementation and QA progress. It is not a deployment record.

## 2026-06-17 Overnight Backlog Pass

- Confirmed work stayed inside the Operon Bathrooms app.
- Audited public SEO pages, lead flows, admin-lite, notification/response workflow, lead qualification,
  manual review report generator and chatbot.
- Updated stale project documentation so current local phase status matches the codebase.
- Added this execution log, risk register and next-actions file as durable project spine documents.
- Ran local checks only. No deployment, no push, no production Supabase changes and no production
  Netlify changes were performed.

## 2026-06-17 Stage 3 Supabase And Chatbot Handoff Pass

- Applied the additive Stage 3 schema to the approved Operon Bathrooms Supabase project.
- Created `operon_chatbot_qualifications` and `operon_follow_up_tasks`.
- Tightened anon grants so anon has insert-only access to `bathroom_estimates` and no read/update/delete access.
- Verified RLS, policies, grants, preview insert/read and cleanup for chatbot qualification and follow-up tasks.
- Added a consent-based chatbot handoff endpoint and admin-only chatbot/follow-up read endpoint.
- Added a private admin dashboard panel for chatbot handoffs and open follow-up tasks.
- No Netlify deployment or production Netlify setting changes were performed.

## 2026-06-18 PR QA And Hardening Pass

- Created `docs/next-100-big-tasks-2026-06-18.md` for the next local QA/security/integration queue.
- Added `scripts/qa-public-safety.mjs` and `npm run qa:public-safety`.
- Added `scripts/qa-client-bundle-safety.mjs` and `npm run qa:bundle-safety`.
- Added `npm run qa:local` to group lint, typecheck, tests, build and migration verification.
- Added public API response safety tests for quote review, request review, site measure and chatbot handoff.
- Added admin-boundary tests for noindex/nofollow metadata and unauthenticated admin API rejection.
- Tightened `/bathroom-quote-sydney` copy from fixed-price wording to package-price wording.
- Ran local checks only. No deployment, no push to main, no production Supabase changes and no production
  Netlify changes were performed.

## 2026-06-19 Responsive QA Harness

- Added `scripts/qa-responsive.mjs` and `npm run qa:responsive`.
- The script uses local headless Chrome through the DevTools protocol, not a paid service or deployed site.
- Checked `/`, `/quote`, `/quote/review`, `/request-review`, `/site-measure` and `/admin/leads` at
  1440px, 1280px, 768px and 390px.
- Verified one H1, no horizontal overflow, chatbot hidden on admin, chatbot visible on public routes and
  no chatbot launcher overlap with submit controls.
- Generated local screenshots in `.local/qa-responsive`; screenshots are not committed.

## 2026-06-19 Authorised Admin Workflow QA

- Added local-store authorised admin workflow tests for the main private operator path.
- Covered admin lead list filtering, manual-review queue reads, bulk qualification, safe response templates,
  manual review report preview/persist/update, qualification overrides and chatbot qualification/follow-up reads.
- Kept the test in safe local mode by blanking Supabase service env vars and using `OPERON_BATHROOMS_ADMIN_TOKEN`
  only inside the test process.
- Confirmed public response copy remains planning guidance only while internal report and follow-up data remain
  behind token-gated admin APIs.

## 2026-06-19 Supabase Staging Contract Harness

- Added `npm run qa:supabase:staging` as an opt-in live verification harness for approved local/staging
  Supabase projects.
- The harness refuses production-looking targets, does not print keys, verifies anon insert/read/mutation
  boundaries and checks service-role-only chatbot qualification/follow-up task access.
- The harness creates marked QA rows and cleans them up after the run.
- It is intentionally not included in `npm run qa:local` because it requires explicit non-production
  Supabase credentials and approval.

## 2026-06-19 Upload Boundary QA

- Strengthened public API safety tests so quote-review input with fake public upload URLs, signed URLs,
  storage paths and bucket names does not return those values in public responses.
- Confirmed upload storage remains placeholder-safe only; private storage implementation still requires an
  approved Supabase Storage design and policies.

## 2026-06-19 Notification Failure QA

- Added route-level public API safety coverage for a configured email provider returning a delivery error.
- Confirmed lead capture still returns a safe public success response and does not expose provider keys,
  authorization headers or private notification internals.
- Real email sending remains a staging-only verification task once approved email env vars are configured.

## 2026-06-19 Supabase Contract Re-Verification

- Re-verified the approved Operon Bathrooms Supabase project `qulwdtpsljleyqkjfvji`.
- Confirmed all Bathrooms and Operon Stage 3 tables have RLS enabled.
- Confirmed anon has only INSERT on `bathroom_estimates`; anon SELECT/UPDATE/DELETE checks were blocked.
- Confirmed service-role grants are present for lead, admin, manual-review, chatbot qualification and follow-up tables.
- Created marked chatbot qualification and follow-up task QA rows through service-role access, read them back,
  then cleaned them up. Remaining marked rows: `0`.
- Security advisor notices matched the intended contract: private RLS tables have no public policies, and the
  estimate table has the approved anon insert-only policy.

## 2026-06-20 Final Local And Browser Readiness QA

- Ran `npm run qa:local && git diff --check`; lint, typecheck, 44 tests, build, migration verification,
  client bundle safety and whitespace checks passed.
- Started a fresh local dev server at `http://127.0.0.1:3000`.
- Ran `npm run qa:crawl -- http://127.0.0.1:3000`; all checked public routes returned 200 with title,
  one H1 and canonical.
- Ran `npm run qa:public-safety -- http://127.0.0.1:3000`; public routes, sitemap, robots and copy safety
  stayed inside the approved public boundary.
- Ran `npm run qa:responsive -- http://127.0.0.1:3000`; 6 routes passed at desktop, laptop, tablet and
  mobile sizes with no horizontal overflow. Chatbot was visible on public routes and hidden on admin.
- Stopped the local dev server after QA.

## 2026-06-20 PR Scope Review

- Ran `git diff --name-status origin/main...HEAD`; changed files are scoped to the Operon Bathrooms app,
  documentation, tests, scripts, migrations and configuration in this repository.
- Confirmed no generated `.local` QA artifacts are tracked.
- Confirmed no `.env` files are tracked.
- Ran a quick secret/boundary scan for Supabase service-role placeholders, anon key assignments, private key
  markers and production-setting language. Matches were expected placeholders, docs, migration comments or
  safety wording; no committed secret values were found.
- Re-ran `npm run test -- --runInBand`; all 44 public lead-flow, admin workflow, chatbot, notification,
  manual review and validation tests passed.

## 2026-06-20 Phase 5 Manual Review Report Polish

- Added manual review report tests for missing evidence questions, strata/asbestos/waterproofing prompts,
  site-measure readiness states and customer-proposal boundary language.
- Fixed site-measure readiness logic so high/critical risk or manual-review-required leads cannot be marked
  "Ready to book site measure" merely because evidence is complete.
- Re-ran `npm run qa:local && git diff --check`; lint, typecheck, 47 tests, build, migration verification,
  client bundle safety and whitespace checks passed.

## 2026-06-20 Private Upload Storage Decision Brief

- Added `docs/qa/private-upload-storage-decision.md`.
- Confirmed current MVP upload handling remains placeholder-safe: local file type/size validation and metadata
  only, with no public storage path or signed URL returned.
- Documented future private bucket, object path, signed URL, metadata table, RLS and QA requirements.
- Storage implementation remains deferred until explicitly approved.

## 2026-06-20 Email Staging QA Harness

- Added `npm run qa:email:staging` and `docs/qa/email-staging-verification.md`.
- The harness verifies preview payload preparation, customer acknowledgement safety, admin attribution/risk
  details and provider-failure handling without requiring real email delivery.
- Real staging email send is explicitly opt-in with `OPERON_BATHROOMS_EMAIL_QA_SEND_APPROVED=true` and
  approved provider env vars.
- Ran `npm run qa:email:staging`; preview and provider-failure contracts passed. Real send was not run because
  provider env vars were not present.

## Operating Notes

- Use `npm run qa:local` before handoff.
- Use `npm run qa:supabase:staging` only after an approved local/staging Supabase target is configured.
- For rendered public route checks, start a clean dev server and run `npm run qa:crawl -- http://127.0.0.1:3000`
  plus `npm run qa:public-safety -- http://127.0.0.1:3000` and
  `npm run qa:responsive -- http://127.0.0.1:3000`.
- Restart `next dev` after `next build` before running server-based crawls.
- Treat Supabase migrations as local files until Vincent explicitly approves applying them to a local
  or staging project.
- Keep private rates, lead qualification logic, internal notes and manual review reports out of public pages.
