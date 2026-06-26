# Phase 6 Path Decision

Date: 2026-06-27

Decision: handoff-contract-only implementation first.

## Approved First Path

Vincent selected the handoff-contract-only path for Phase 6.

This path may define and implement a safe internal-only data contract that maps existing bounded Design Studio context into a future Quote OS preparation layer.

## Why This Path Comes First

Handoff-contract-only is the lowest-risk Phase 6 implementation path because it creates structure without creating pricing, proposals, procurement, admin automation or public Quote OS output.

It should help later internal review work understand:

- bathroom type and planning preferences
- approximate layout context
- public layout-risk prompts
- governed catalogue-candidate shortlist context
- deterministic constraint prompts
- evidence-readiness status
- preferred next step
- safe questions to confirm before site measure

## Approved Implementation Boundary

The next implementation branch may:

- define a versioned internal handoff contract
- add allowlist/denylist helpers for Design Studio to Quote OS context
- add tests proving only safe fields are included
- preserve backwards compatibility with existing `/quote` estimate handoff
- document how an internal reviewer could use the handoff context later

The next implementation branch must not:

- generate final prices, contract pricing or quote approval
- generate public proposals
- create procurement, supplier, SKU, availability, payment or CRM workflows
- add live supplier feeds or verified SKUs
- expose private rates, margins, supplier costs, scoring or admin notes
- add production storage, Supabase migrations or service-role access
- change public discovery, sitemap, nav/footer exposure or indexing
- add user-entered measurements, AR/browser-camera or upload/storage

## Contract Direction

The preferred implementation shape is an internal-only, allowlisted object such as `BathroomDesignQuoteOsHandoff`.

It should be derived from the current public planning data only. It should not require a new persisted database table, production storage or public API route unless separately approved.

Any schema version bump must be justified before coding. If the handoff can be derived from existing `BathroomDesignDraft` version `0.5`, prefer no draft schema change.

## Gate Reminder

This decision approves the Phase 6 path, not the full Quote OS product.

Public release exposure, Quote OS pricing, proposal generation, procurement, admin automation, payments and CRM remain locked.
