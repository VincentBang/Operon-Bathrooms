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

Server-side lead storage also supports `SUPABASE_SERVICE_ROLE_KEY` for a bathroom-specific local or
staging Supabase project. If it is missing, local API routes still validate inputs and return safe
success payloads and write to a private local `.local/bathroom-leads.json` fallback so admin workflow
can be tested without production credentials.

Admin-lite uses `OPERON_BATHROOMS_ADMIN_TOKEN`. Admin routes return a safe configuration error when
the token is missing. Admin pages are excluded from public navigation and sitemap and marked noindex.

Notification emails are optional. The app prepares internal notification and customer
acknowledgement payloads for every lead. If `RESEND_API_KEY`, `OPERON_BATHROOMS_ADMIN_EMAIL` and
`OPERON_BATHROOMS_FROM_EMAIL` are configured and `OPERON_BATHROOMS_NOTIFICATION_MODE=send`, the API
routes attempt to send via Resend. The default mode is `preview`, which prepares the payloads but
does not send email. If email vars are absent or provider delivery fails after storage, lead storage
still succeeds and public responses include only the safe flags `notificationPrepared`,
`adminNotificationSent`, `customerAcknowledgementSent` and a safe warning.

## Scripts

```bash
npm run test
npm run lint
npm run typecheck
npm run build
npm run verify:supabase:migrations
npm run qa:supabase:staging
npm run qa:bundle-safety
npm run qa:local
```

Rendered public-route checks require a running local server:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
npm run qa:crawl -- http://127.0.0.1:3000
npm run qa:public-safety -- http://127.0.0.1:3000
npm run qa:responsive -- http://127.0.0.1:3000
```

Restart `next dev` after running `npm run build` before server-based crawls. Keeping a dev server
open while `.next` is rewritten can cause transient Next.js dev-manifest errors unrelated to app code.

## Private estimate data

The MVP rate card is stored at `data/private/bathroom-rate-card.json` and imported only by server
calculation code. Public API responses expose only planning ranges, confidence scores, assumptions,
exclusions, risk flags and compliance prompts.

## Supabase

The draft migration is in `supabase/migrations/202606170001_create_bathroom_estimates.sql`.
Apply it only to a new bathroom-specific development project after review.

`npm run verify:supabase:migrations` statically checks the local migration files for RLS and anon-policy
boundaries. `npm run qa:supabase:staging` is a live, opt-in local/staging verification harness. It requires
`OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true`, `OPERON_BATHROOMS_SUPABASE_QA_TARGET=local` or `staging`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. It refuses
production-looking targets, verifies anon insert/read/mutation boundaries and checks service-role-only
chatbot qualification/follow-up task access with marked rows that are cleaned up after the run.

Phase 2 draft intake tables are documented in
`supabase/migrations/202606170002_create_bathroom_phase2_intake_tables.sql`. They are local SQL
only and have not been applied to any production project.

Attribution additions for estimate leads are documented in
`supabase/migrations/202606170003_add_attribution_to_bathroom_estimates.sql`. They are local SQL only
and have not been applied to production.

Response workflow fields and the response event table are documented in
`supabase/migrations/202606170004_add_bathroom_response_workflow.sql`. They are local SQL only and
have not been applied to production.

Lead qualification fields, evidence checklist fields and qualification event tracking are documented
in `supabase/migrations/202606170005_add_bathroom_lead_qualification.sql`. They are local SQL only
and have not been applied to production. Qualification is admin-only and should not be surfaced on
public pages.

Admin-lite notification contract fields and the admin activity log are documented in
`supabase/migrations/202606170006_add_admin_lite_notification_contract.sql`. They are local SQL only
and have not been applied to production.

Notification/response workflow alignment fields and the updated response status contract are
documented in `supabase/migrations/202606170007_notification_response_contract_alignment.sql`. This
is local SQL only and has not been applied to production.

Qualification enum constraints for manual-review workflow fields are documented in
`supabase/migrations/202606170008_qualification_contract_alignment.sql`. This is local SQL only and
has not been applied to production.

Internal manual review report storage is documented in
`supabase/migrations/202606170009_create_bathroom_manual_review_reports.sql`. This table is
admin-only, has no anon policies and has not been applied to production.

## Admin lead workflow

Local admin-lite is available at `/admin/leads?token=<OPERON_BATHROOMS_ADMIN_TOKEN>`. It supports
response tracking, manual review queue filtering, system qualification, manual qualification
overrides, evidence checklist updates and copyable response templates. The admin page is marked
noindex,nofollow and admin routes are excluded from sitemap and public navigation.

`npm test` includes safe local-store admin workflow coverage for token-gated lead reads, manual review
report generation/update, response templates, qualification overrides and chatbot follow-up reads. These
tests blank Supabase service env vars inside the test process and do not touch production services.

Protected Phase 3a API routes include `/api/admin/leads`, `/api/admin/lead-detail`,
`/api/admin/lead-update`, `/api/admin/lead-response-update`, `/api/admin/response-template` and
`/api/admin/notification-preview`. They require the admin token and return safe normalized lead data
without service-role keys, storage paths or private rate-card data.

Manual review report routes include `/api/admin/manual-review-report`,
`/api/admin/manual-review-report-preview` and `/api/admin/manual-review-report-update`. Reports are
internal only, must not be sent to customers as proposals or quotes, and intentionally avoid final
pricing, contract terms, legal advice, compliance certification, rate cards, supplier costs and
margins.

## Public disclaimer

All estimate copy must remain clear that outputs are planning guidance only, not final quotes,
contracts, building advice or legal advice. NSW prompts mention licence checks over $5k, deposits
generally limited to 10%, and HBCF cover generally required over $20k.
