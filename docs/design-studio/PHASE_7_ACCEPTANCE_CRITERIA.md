# Phase 7 Acceptance Criteria

## Phase Name

Phase 7 Shared Operon System Infrastructure.

## Current Status

Vincent approved Phase 7 to begin as an acceptance-criteria-only planning task on 2026-06-28.

This document does not approve implementation.

## Phase Intent

Phase 7 may define how Operon Bathrooms Design Studio, lead capture, manual review and later Quote OS foundations could align with broader Operon System infrastructure across future Operon surfaces.

The phase should make shared contracts clearer before any code is extracted, duplicated, published or connected across repos.

## Allowed Direction

Phase 7 acceptance criteria may define:

- shared language boundaries for planning guidance, quote review, site measure and contract-pricing readiness
- shared lead lifecycle states and naming conventions
- shared evidence-readiness concepts
- shared manual review and follow-up task concepts
- shared event naming principles for future analytics
- shared feature-flag, noindex and discovery-gate conventions
- shared safety checks for private pricing, rate cards, supplier data, SKU data, admin notes and service keys
- shared UI/token governance as documentation only
- shared data-contract compatibility rules
- shared PR, branch and gate-review workflow expectations
- migration-readiness questions for future local/staging-only database work

## Not Approved In This Task

Do not implement:

- shared package extraction
- monorepo restructuring
- npm package publishing
- cross-repo imports
- shared UI library changes
- shared API routes
- shared Supabase schema changes
- production Supabase changes
- production Netlify changes
- auth, user accounts or tenant infrastructure
- CRM, payment, procurement or supplier integrations
- live Quote OS workflow
- public release exposure or indexing changes
- design-system refactors in app code
- new admin automation
- data migration or backfill scripts

## Must Pass Before Any Phase 7 Implementation

- Define which contracts are candidates for sharing and which must remain Bathrooms-local.
- Confirm whether any future shared contract changes require versioning.
- Confirm no current Bathrooms public route depends on shared infrastructure.
- Confirm no Operon Flooring, Operon Kitchens or Oz Timber Floor repo changes are required.
- Confirm no production Supabase or Netlify change is required.
- Define rollback criteria for any future shared contract adoption.
- Define local/staging-only verification requirements before any data or service integration.
- Define bundle-safety and public-language checks for shared modules.
- Define ownership and review rules before shared code crosses repo boundaries.

## Candidate Shared Contracts

Candidate contracts for later design only:

- lead source attribution fields
- lead lifecycle status labels
- evidence-readiness item shape
- follow-up task status labels
- manual review risk summary sections
- public-language safety rules
- noindex/discovery feature-flag vocabulary
- planning-only handoff metadata
- admin-only/private data boundary labels

These candidates remain documentation-only until a separate implementation gate is approved.

## Bathrooms-Local Contracts To Preserve

Keep these Bathrooms-local unless separately approved:

- `BathroomDesignDraft`
- `BathroomDesignQuoteOsHandoff`
- bathroom-specific estimate inputs and outputs
- bathroom quote review scoring
- bathroom-specific risk flags
- bathroom-specific compliance prompts
- bathroom-specific manual review report content
- bathroom-specific Supabase tables and migrations

## Public-Language Rules

Shared wording must preserve:

- planning guidance only
- site measure required
- selections required
- licensed-trade checks required
- written scope confirmation required before contract pricing
- no legal advice
- no compliance certification
- no final quote, fixed price or quote approval language

## Private Data Rules

Shared infrastructure must never expose:

- internal rate cards
- supplier costs
- labour rates
- margins
- admin notes
- private scoring or qualification logic
- service role keys
- access tokens or secrets
- live supplier feeds
- confirmed SKU data
- procurement or payment data

## Testing Requirements For Later Implementation

Any later Phase 7 implementation must include:

- typecheck
- unit tests for shared contract adapters
- public safety tests for wording and private data markers
- bundle-safety scan
- migration verification if database files are added
- route/discovery checks if public surfaces are affected
- feature-flag tests if any shared feature gate is introduced
- local build before PR

## Rollback And Pause Rules

Pause Phase 7 if:

- shared work requires edits outside Operon Bathrooms before explicit approval
- public wording implies final pricing, legal advice, compliance certification or contract readiness
- private pricing, supplier, SKU, admin-note, score or secret data could reach a public bundle
- production Supabase or Netlify changes become necessary
- route exposure, sitemap inclusion or public discovery changes are required
- implementation drifts into full Quote OS, procurement, payment, CRM or shared admin automation

## Gate Exit

Phase 7 acceptance criteria can be considered ready when:

- this document is reviewed and merged
- stage status records Phase 7 as acceptance-criteria-only
- next actions keep implementation locked
- local `git diff --check` passes

After this gate, the next separate decision should choose whether to pause or approve a very small Phase 7 docs-only architecture map. Implementation should remain locked until a later explicit approval.
