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

Run and approve the human release-review checklist:

1. Use `docs/qa/human-release-review-checklist-2026-06-28.md`.
2. Review public routes, forms, chatbot, admin/private boundaries, SEO copy and accessibility spot checks.
3. Record pass, pass-with-notes or blocked outcome in a closeout note.
4. Keep live staging Supabase verification and real staging email send separate unless approved env vars are supplied.
5. Keep private Supabase Storage implementation and Quote OS behind separate explicit approvals.

## Overnight Follow-Up Queue

Continue from `docs/next-100-tasks-2026-06-19.md`, `docs/next-200-continuation-tasks-2026-06-21.md`
and `docs/next-500-continuation-tasks-2026-06-23.md` before starting Quote OS. The current priority is
human release review, staging email send only if approved env vars are supplied, private upload
storage only after explicit policy approval and Quote OS only after separate approval.
