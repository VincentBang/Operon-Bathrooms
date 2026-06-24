# Design Studio Controlled Noindex Pilot Prep

Date: 2026-06-24

Branch: `codex/design-studio-controlled-noindex-pilot-prep`

## Status

Vincent approved preparing a controlled noindex pilot branch after the release-exposure criteria were merged.

This branch is docs/config-only. It does not change route behavior, feature flags, navigation, sitemap output, indexing, analytics, storage, lead flows, measurements, AR/browser-camera, Quote OS, pricing or procurement.

## Pilot Intent

The controlled noindex pilot would let a limited audience use `/design-studio` while Operon Bathrooms checks whether the flow improves qualified planning, quote-review, request-review and site-measure intent.

The pilot must remain a planning preview. It must not become a public SEO page, final quote tool, measured plan, compliance checker, supplier catalogue, product-fit verifier, procurement flow or Quote OS surface.

## Current Technical Finding

The current enablement flag is `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO`.

Today this single flag controls:

- route rendering for `/design-studio`
- nav and footer discovery links
- sitemap inclusion

That means the current flag is suitable for local and internal feature-flagged QA, but it is not sufficient by itself for a controlled noindex pilot that must stay excluded from primary navigation and sitemap output.

## Required Later Implementation Before Pilot Exposure

Before any controlled pilot is exposed outside local/internal review, add a separate approved implementation branch that can keep the route enabled while keeping discovery hidden.

Required behavior:

- `/design-studio` can render for the controlled pilot audience.
- `/design-studio` remains `noindex,nofollow`.
- `/design-studio` is excluded from sitemap output in pilot mode.
- `/design-studio` is excluded from primary nav and footer discovery in pilot mode.
- The route can be disabled quickly through environment configuration.
- The implementation does not add measurement fields, AR/browser-camera, upload/storage, pricing, procurement or Quote OS behavior.

Suggested future config shape:

- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true` for route rendering.
- `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=hidden` for controlled noindex pilot discovery.
- `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=public` only after a later public-discovery approval.

Do not add or rely on those new variables until a separate implementation branch is approved.

## Pilot Audience

Recommended initial audience:

- Vincent and internal Operon reviewers.
- A small number of trusted manual-review users already in conversation with Operon.
- No broad SEO traffic.
- No ads traffic.
- No anonymous public launch.

## Pilot Entry Rules

Allowed entry paths during a controlled noindex pilot:

- direct shared link
- manual email or message to trusted reviewers
- internal admin/manual-review note

Not allowed without later approval:

- homepage nav link
- footer public link
- sitemap inclusion
- indexable landing page
- paid ads
- SEO guide links
- chatbot mass routing

## QA Before Pilot

Run on updated `main` after the future implementation branch merges:

- `npm run qa:local`
- `git diff --check`
- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run build`
- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run qa:design-studio:a11y -- <local-url>`
- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run qa:responsive -- <local-url>`
- human VoiceOver or equivalent screen-reader pass

Manual checks:

- disabled flag hides route
- pilot mode renders route
- pilot mode keeps metadata `noindex,nofollow`
- pilot mode excludes sitemap
- pilot mode excludes nav and footer links
- CTAs route only to `/quote`, `/quote/review`, `/request-review` and `/site-measure`
- no final quote, fixed price, legal advice, compliance certification or measured-plan wording
- no internal rates, supplier costs, labour rates, margins, admin notes, lead scoring or rate-card markers
- no horizontal overflow at 390px

## Pilot Metrics

Do not fabricate results. Track only real pilot observations.

Minimum useful metrics:

- started Design Studio sessions
- completed Design Studio summaries
- CTA clicks to estimate, quote review, request review and site measure
- copied or printed summaries
- mobile completion rate
- abandonment by step
- user confusion about planning versus measured output
- qualified lead handoff notes from manual review

## Privacy And Data Boundary

The pilot must not add:

- media upload
- image persistence
- Supabase Storage
- analytics image capture
- exact address capture
- contact-data capture inside Design Studio
- private pricing or lead scoring in local storage

Allowed data remains the existing bounded `BathroomDesignDraft` schema version `0.5` and safe handoff context only.

## Rollback

Rollback for the current repo state:

- turn off `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO`
- rebuild/restart the affected environment
- confirm `/design-studio` returns 404 or is otherwise unavailable
- confirm sitemap and nav do not expose `/design-studio`

Rollback after the future discovery split:

- set the route flag off, or set pilot discovery to hidden/disabled according to the approved implementation
- rerun sitemap/nav/noindex checks

## Gate Exit

This prep branch may exit when Vincent chooses one of:

1. Pause pilot work.
2. Approve a small implementation branch to split route enablement from nav/sitemap discovery.
3. Request changes to the pilot prep docs/config warning.

Do not begin pilot exposure from the current single-flag behavior.
