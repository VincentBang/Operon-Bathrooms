# Operon Bathrooms Next Actions

## Immediate QA

1. Run a local crawl against public routes and confirm titles, H1s, canonicals and CTAs.
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
2. Add chatbot-origin attribution or handoff only if privacy and storage rules are approved.
3. Build private upload storage for quote files only when Supabase Storage policies are explicitly approved.
4. Do not start Bathroom Quote OS until chatbot, manual review reports and admin QA are stable.
