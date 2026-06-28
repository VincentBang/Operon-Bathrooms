# Operon Bathrooms Human Release Review Checklist - 2026-06-28

Status: READY_FOR_HUMAN_REVIEW

This checklist converts the merged local release-hardening evidence into a human review pass. It does not deploy,
modify production Supabase, modify production Netlify, unlock private upload storage, unlock Quote OS or change the
paused Design Studio Phase 7 status.

## Review Setup

Reviewer:

Date:

Environment reviewed:

Branch/commit reviewed:

Local URL or approved non-production URL:

## Preconditions

- [ ] Reviewer has read `docs/qa/release-hardening-evidence-2026-06-28.md`.
- [ ] Reviewer has read `docs/qa/release-decision-packet-2026-06-28.md`.
- [ ] Review target is local or approved non-production only.
- [ ] No production Supabase or Netlify settings are being changed.
- [ ] No deployment is being performed as part of this checklist.
- [ ] Private upload storage, Quote OS and Design Studio Phase 7 implementation remain locked.

## Public Route Visual Review

Check each route at desktop and mobile widths.

| Route | Desktop pass | Mobile pass | Notes |
| --- | --- | --- | --- |
| `/` |  |  |  |
| `/quote` |  |  |  |
| `/quote/review` |  |  |  |
| `/request-review` |  |  |  |
| `/site-measure` |  |  |  |
| `/bathroom-renovation-cost-sydney` |  |  |  |
| `/bathroom-quote-sydney` |  |  |  |
| `/services/full-bathroom-renovation` |  |  |  |
| `/services/apartment-bathroom-renovation-sydney` |  |  |  |
| `/services/ensuite-renovation` |  |  |  |
| `/services/small-bathroom-renovation` |  |  |  |
| `/services/bathroom-refresh` |  |  |  |
| `/services/laundry-bathroom-renovation` |  |  |  |
| `/how-it-works` |  |  |  |
| `/faq` |  |  |  |
| `/privacy` |  |  |  |
| `/terms` |  |  |  |

Pass criteria:

- [ ] Page loads without visible crash or hydration error.
- [ ] One clear H1 is visible.
- [ ] Primary CTA is visible and understandable.
- [ ] No obvious horizontal overflow.
- [ ] No overlapping sticky CTA, chatbot launcher or form submit controls.
- [ ] Public wording remains planning guidance only.
- [ ] No final quote, fixed-price guarantee, legal advice or compliance certification wording.
- [ ] No private rates, margins, supplier costs, lead scoring, internal notes or manual-review reports.

## Form Review

### Planning Estimate

- [ ] `/quote` starts correctly.
- [ ] Required fields are understandable.
- [ ] Validation messages are usable.
- [ ] Estimate result says planning range only.
- [ ] Result CTAs route to quote review, request review or site measure as appropriate.
- [ ] Result does not expose rate cards, labour rates, supplier costs, margins or private scoring.

Notes:

### Quote Review

- [ ] `/quote/review` form is usable on mobile.
- [ ] Required consent fields are clear.
- [ ] Honeypot field is not visible to normal users.
- [ ] Preliminary review result uses clarify/confirm language rather than accusing a builder.
- [ ] Deposit, HBC/HBCF, waterproofing and strata prompts are general guidance only.
- [ ] Upload UI remains placeholder-safe if storage is not configured.

Notes:

### Request Review

- [ ] `/request-review` form is usable on mobile.
- [ ] Confirmation state explains what Operon will review.
- [ ] Copy reminds users this is not a final quote.
- [ ] Preferred next step is clear.

Notes:

### Site Measure

- [ ] `/site-measure` form is usable on mobile.
- [ ] Page explains what online estimates cannot confirm.
- [ ] Confirmation state explains what to prepare.
- [ ] Copy says contract pricing requires site inspection, selections, licensed trade checks and written scope
  confirmation.

Notes:

## Chatbot Review

- [ ] Launcher is visible on public routes.
- [ ] Launcher is not visible on `/admin/leads`.
- [ ] Chat panel opens and closes cleanly.
- [ ] Mobile chat panel fits viewport.
- [ ] Quick prompts route users to structured forms.
- [ ] Pricing responses say online guidance is planning only.
- [ ] Quote review responses route to `/quote/review`.
- [ ] Site measure responses route to `/site-measure`.
- [ ] Emergency, DIY, unlicensed, legal-advice and private-pricing prompts are safely redirected or refused.
- [ ] Chatbot does not expose internal rates, margins, supplier costs, lead scoring or admin notes.

Notes:

## Admin And Private Boundary Review

- [ ] Public navigation does not link to admin.
- [ ] Public footer does not link to admin.
- [ ] Sitemap does not include admin routes.
- [ ] `/admin/leads` remains noindex/nofollow.
- [ ] Unauthenticated admin APIs reject access.
- [ ] Public endpoints do not return internal notes, manual review reports, lead qualification fields or follow-up tasks.

Notes:

## SEO And Content Review

- [ ] Page titles are appropriate for the public SEO pages.
- [ ] H1s are unique and clear.
- [ ] Canonicals are present.
- [ ] Internal CTAs match the intended journey.
- [ ] No thin suburb pages are introduced.
- [ ] Bad-fit topics such as cheap renovation, DIY waterproofing, emergency leak repair, supply-only fixtures and legal
  advice are not used as acquisition positioning.

Notes:

## Accessibility Spot Check

- [ ] Keyboard can reach primary CTAs.
- [ ] Keyboard can open and close the chatbot.
- [ ] Form fields have visible labels or accessible names.
- [ ] Focus is visible.
- [ ] Text contrast is readable in normal review conditions.
- [ ] Error and confirmation states are understandable without relying on color alone.

Notes:

## Release Boundary Confirmation

- [ ] No deployment performed.
- [ ] No production Supabase changes performed.
- [ ] No production Netlify changes performed.
- [ ] No private upload storage implemented or unlocked.
- [ ] No Quote OS work implemented or unlocked.
- [ ] No Design Studio Phase 7 work implemented or unlocked.
- [ ] No Operon Flooring, Operon Kitchens or Oz Timber Floor repositories touched.

## Review Outcome

Choose one:

- [ ] PASS - local evidence and human review are acceptable for the next release decision.
- [ ] PASS WITH NOTES - acceptable after documented minor follow-up.
- [ ] BLOCKED - do not proceed until blockers below are resolved.

Blockers:

Follow-up notes:

Reviewer sign-off:

## Recommended Next Task

If this checklist passes, create a small closeout note recording the human release-review result. Keep live staging
Supabase verification, real staging email send, private upload storage and Quote OS behind separate explicit approvals.

