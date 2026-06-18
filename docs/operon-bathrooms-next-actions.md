# Operon Bathrooms Next Actions

## Immediate QA

1. Run `npm run qa:crawl -- http://localhost:3000` against a local dev server and confirm titles, H1s, canonicals and forbidden wording checks.
2. Run browser QA for `/`, `/quote`, `/quote/review`, `/request-review`, `/site-measure`,
   `/admin/leads` and the chatbot at 1440px, 1280px, 768px and 390px.
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

Run browser QA for the public lead flows, admin dashboard, chatbot handoff form and Stage 3 follow-up panel at desktop, laptop, tablet and mobile widths.

## Overnight Follow-Up Queue

Continue from `docs/next-100-big-tasks-2026-06-18.md` before starting Quote OS. The current priority is repeatable public safety checks, public API response leak checks, admin-token boundary checks and responsive QA evidence.
