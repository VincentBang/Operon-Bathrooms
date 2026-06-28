# Operon Bathrooms Release Hardening Plan - 2026-06-28

Status: GATE_REVIEW_READY

This is a separate planning lane for Operon Bathrooms after the Design Studio Phase 7 pause. It does not unlock
Quote OS, private upload storage, production Supabase changes, production Netlify changes, deployment, public
exposure changes or Design Studio implementation.

## Purpose

Prepare the existing Operon Bathrooms public acquisition, lead capture, admin-lite, chatbot and manual-review
surfaces for a disciplined QA and release-hardening pass before any larger implementation phase starts.

The next useful work is not another feature build. The next useful work is proving that the current system remains
safe, private, mobile-usable, planning-only and operationally reviewable.

## Why This Is Next

- Design Studio Phase 7 is paused and locked unless a separate narrow implementation scope is approved.
- The master plan says the current public acquisition and qualification layer should receive QA, security review,
  copy tightening and integration hardening before later Quote OS foundation work.
- Private upload storage remains approval-gated until the storage policy and RLS boundary are explicitly approved.
- Real staging email sends remain approval-gated until approved provider environment variables are supplied.
- Quote OS remains locked until public flows, admin-lite, chatbot handoff and manual-review boundaries are stable.

## Scope

In scope:

- Public route crawl and metadata verification.
- Responsive QA at desktop, laptop, tablet and mobile widths.
- Public copy safety checks for planning guidance only.
- Internal/admin boundary checks.
- Lead-flow verification for estimate, quote review, request review, site measure and chatbot handoff.
- Local or staging Supabase verification only when an approved non-production target is configured.
- Email staging verification only when approved provider environment variables are supplied.
- Documentation of known limitations and release decision evidence.

Out of scope:

- Deployment.
- Production Supabase changes.
- Production Netlify changes.
- Private upload storage implementation.
- Quote OS implementation.
- Pricing, proposal, procurement or CRM automation.
- Design Studio Phase 7 implementation.
- New public discovery, sitemap or navigation exposure.

## Workstreams

### A. Public Surface QA

Goal: confirm public pages are crawlable, internally linked and safe.

Checks:

- Run `npm run qa:crawl -- http://127.0.0.1:3000`.
- Confirm public routes return 200.
- Confirm titles, one H1 and canonicals are present.
- Confirm sitemap excludes admin and internal routes.
- Confirm no public route exposes private rates, margins, lead scoring, admin notes or manual-review reports.
- Confirm public wording says planning guidance only and avoids final quote, legal advice and compliance guarantees.

### B. Responsive And Mobile QA

Goal: confirm lead flows are usable across the intended viewport set.

Routes:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/admin/leads`

Viewports:

- 1440px desktop.
- 1280px laptop.
- 768px tablet.
- 390px mobile.

Checks:

- Run `npm run qa:responsive -- http://127.0.0.1:3000`.
- Confirm no horizontal overflow.
- Confirm form submit buttons are usable.
- Confirm chatbot launcher does not obscure critical form actions.
- Confirm chatbot remains hidden on admin routes.

### C. Admin And Private Boundary QA

Goal: prove private operator data stays private.

Checks:

- Confirm admin routes remain noindex/nofollow.
- Confirm admin links are absent from public nav, footer, sitemap and public CTAs.
- Confirm unauthenticated admin APIs reject access.
- Confirm service-role access remains server-side only.
- Confirm lead qualification fields, internal notes, follow-up tasks and manual review reports are not returned
  by public endpoints.

### D. Lead-Flow QA

Goal: confirm the live acquisition paths create safe, structured, non-binding user outcomes.

Flows:

- Planning estimate.
- Existing quote review.
- Scope review request.
- Site measure request.
- Chatbot guidance and consent-based handoff.

Checks:

- Validate required fields, consent fields and honeypot behavior.
- Confirm public success states are safe and do not reveal internal scoring, rate cards, storage paths or provider
  internals.
- Confirm high-risk topics route users toward quote review, request review or site measure rather than final pricing.
- Confirm risk and compliance prompts remain general guidance only.

### E. Local/Staging Integration Readiness

Goal: prepare evidence without changing production systems.

Checks:

- Run `npm run qa:supabase:staging` only after an approved local or staging Supabase target is configured.
- Verify insert-only public paths, blocked anon reads and service-role-only admin/manual-review reads.
- Run `npm run qa:email:staging` in preview mode by default.
- Run real staging email send only when approved provider environment variables are present and explicit send approval
  is set.
- Keep upload handling placeholder-safe until private storage implementation is separately approved.

### F. Release Decision Packet

Goal: make the release decision auditable.

Required evidence:

- Local command results.
- Manual responsive QA notes.
- Public safety scan result.
- Admin/private boundary result.
- Known limitations.
- Explicit no-deployment and no-production-change confirmation.

## Acceptance Criteria

This planning lane is complete when:

- The plan is reviewed and merged.
- `docs/operon-bathrooms-next-actions.md` points to a current release-hardening QA task rather than stale PR #1
  merge language.
- The execution log records this separate planning lane.
- No code, configuration, database, storage or deployment behavior is changed.
- Quote OS, private upload storage, production changes and Design Studio Phase 7 implementation remain locked.

## Recommended Next Task After Merge

Run the local release-hardening QA evidence pass:

1. Start a clean local dev server.
2. Run `npm run qa:local`.
3. Run `npm run qa:crawl -- http://127.0.0.1:3000`.
4. Run `npm run qa:public-safety -- http://127.0.0.1:3000`.
5. Run `npm run qa:responsive -- http://127.0.0.1:3000`.
6. Capture results in a dedicated QA evidence report.

