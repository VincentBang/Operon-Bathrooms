# Design Studio Release-Exposure Criteria

Date: 2026-06-24

Branch: `codex/design-studio-release-exposure-criteria`

## Status

This is a docs-only release-exposure criteria task.

It does not approve public release, navigation changes, sitemap inclusion, indexing, ads traffic, production analytics, backend storage, user-entered measurements, AR/browser-camera experiments, Quote OS, pricing, procurement, payment or CRM work.

## Release-Exposure Intent

Release exposure would make the existing feature-flagged `/design-studio` route available to a controlled audience so Operon Bathrooms can learn whether the Design Studio improves qualified planning, quote-review, request-review and site-measure intent.

The route must remain a planning and scope-preparation experience. It must not become a measured-plan tool, construction-drawing tool, compliance checker, final quote engine, product-fit verifier, supplier catalogue, procurement workflow or public promise of renovation pricing.

## Eligible Exposure Modes

Release exposure may be considered only in one of these modes:

1. Internal preview only: route remains feature-flagged and shared manually with trusted reviewers.
2. Controlled noindex pilot: route is enabled for limited users but remains noindex/nofollow and excluded from sitemap, primary nav and broad SEO links.
3. Public discovery proposal: a later approval task defines what would need to change before sitemap, nav or indexable exposure.

The recommended first release mode is controlled noindex pilot.

## Must Stay Locked

- User-entered approximate measurement fields.
- AR/browser-camera experiments.
- Camera upload, file upload, persistent media storage or Supabase storage buckets.
- LiDAR, BIM, measured CAD, construction drawings or certified measurement claims.
- AI/API-assisted measurement interpretation or design recommendations.
- Live supplier feeds, verified SKUs, supplier pricing, procurement, checkout or marketplace.
- Quote OS, payment, CRM and contractor workflow integrations.
- Any wording that implies final quote, fixed price, guaranteed compliance, legal advice, waterproofing certification, Class 2/DBP confirmation or build-ready scope.

## Pre-Exposure Gate

Before any controlled exposure begins:

- Confirm the exact exposure mode and audience.
- Confirm `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO` remains the only enablement switch.
- Confirm whether the route stays excluded from sitemap and primary nav.
- Confirm `noindex,nofollow` remains in place for controlled pilot mode.
- Run the feature-flagged local QA suite against updated `main`.
- Repeat the human VoiceOver or equivalent screen-reader pass after the latest feature changes.
- Confirm mobile usability at 390, 768, 1280 and 1440 pixel widths.
- Confirm all CTAs route to `/quote`, `/quote/review`, `/request-review` or `/site-measure` without claiming final pricing.
- Confirm estimate handoff includes only allowlisted planning context.
- Confirm saved local draft data contains no media, personal contact details, precise address data, private scoring, supplier costs, labour rates, margins or rate cards.
- Confirm client bundles contain no private pricing, supplier, margin, service-role or admin-note markers.
- Confirm the route can be disabled quickly by turning off the feature flag.

## Content Requirements

The visible route must consistently say:

- design output is planning guidance only
- layout preview is approximate and not measured CAD
- catalogue candidates are planning archetypes, not verified products or supplier SKUs
- evidence-readiness prompts are preparation prompts, not online verification
- site measure, selections, licensed-trade checks and written scope confirmation are required before contract pricing

The route must not say:

- final quote
- fixed price
- guaranteed price
- build-ready plan
- measured plan
- CAD drawing
- certified measurement
- compliance approved
- waterproofing certified online
- product fit verified
- supplier pricing confirmed

## Measurement Plan

Do not fabricate results. Track only real observations from an approved pilot.

Suggested pilot metrics:

- design starts
- design completions
- CTA clicks to estimate, quote review, request review and site measure
- saved or copied summaries
- mobile completion rate
- abandonment by step
- user-reported confusion about planning versus measured output
- qualified lead conversion from Design Studio handoff
- support/manual-review notes about missing evidence

Suggested quality gates:

- no privacy leak or private pricing leak
- zero public wording issues implying final pricing or legal/compliance advice
- at least one successful mobile completion in each target viewport class during QA
- no critical accessibility blockers in the repeat screen-reader pass
- route can be disabled without code changes

## Manual QA Checklist

- Launch with the feature flag disabled and confirm `/design-studio` is not publicly discoverable.
- Launch with the feature flag enabled and confirm `/design-studio` returns the intended experience.
- Confirm metadata remains `noindex,nofollow` for controlled pilot mode.
- Walk through the full Design Studio flow on desktop and mobile.
- Confirm every step has a clear planning-only boundary.
- Confirm sticky and chatbot UI do not cover Design Studio controls or submit actions.
- Confirm keyboard navigation reaches all controls in a logical order.
- Confirm focus styles are visible.
- Confirm copy/print summary avoids final-pricing, compliance and measured-plan claims.
- Confirm handoff to estimate or review pages preserves only safe context.
- Confirm no horizontal overflow at 390px.

## Rollback Criteria

Disable exposure if:

- users interpret the route as a final quote or measured-plan tool
- any private pricing, supplier cost, margin, lead scoring, admin note or rate-card marker appears publicly
- mobile users cannot complete the flow
- accessibility blockers prevent keyboard or screen-reader use
- CTAs route to broken or misleading paths
- analytics, storage or handoff behavior captures data outside the approved boundary
- the feature starts attracting bad-fit DIY, emergency repair, supply-only or legal-advice traffic

## Gate Exit

This criteria task may exit only when Vincent chooses one of:

1. Pause Design Studio release exposure.
2. Approve controlled noindex pilot preparation.
3. Request changes to the release-exposure criteria.

No implementation, release flag change, navigation change, sitemap change or indexing change is approved by this document.
