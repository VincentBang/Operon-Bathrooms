# Operon Bathrooms Next Actions

## Immediate QA

1. Run `npm run qa:crawl -- http://localhost:3000` against a local dev server and confirm titles, H1s, canonicals and forbidden wording checks.
2. Run `npm run qa:responsive -- http://127.0.0.1:3000` for `/`, `/quote`,
   `/quote/review`, `/request-review`, `/site-measure`, `/admin/leads` and chatbot launcher checks
   at 1440px, 1280px, 768px and 390px.
3. Confirm no public page exposes admin links, internal notes, manual review reports, private rates or
   lead qualification fields.

## Local/Staging Setup

1. Configure a local or staging `OPERON_BATHROOMS_ADMIN_TOKEN`.
2. Configure local or staging Supabase credentials only after Vincent approves the target project.
3. Apply migrations only to local/staging, not production, then verify RLS and insert-only behavior.
4. Test email provider env vars in staging without making email delivery mandatory for builds.

## Product Hardening

1. Add a lightweight local crawl script if useful for repeat QA.
2. Continue QA for the consent-based chatbot-origin handoff and private follow-up task workflow.
3. Build private upload storage for quote files only when Supabase Storage policies are explicitly approved.
4. Do not start Bathroom Quote OS until chatbot, manual review reports and admin QA are stable.

## Current Recommended Next Task

Run the approved local/staging Supabase verification harness with non-production credentials:

```bash
npm run qa:supabase:staging
```

## Overnight Follow-Up Queue

Continue from `docs/next-100-tasks-2026-06-19.md` before starting Quote OS. The current priority is approved local/staging Supabase verification, final PR readiness, public lead flow QA, admin workflow QA, staging email checks and the private upload storage decision.
