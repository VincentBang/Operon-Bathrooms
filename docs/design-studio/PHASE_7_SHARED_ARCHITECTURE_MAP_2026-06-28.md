# Phase 7 Shared Architecture Map

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only shared architecture map for Phase 7 Shared Operon System Infrastructure.

It does not implement shared infrastructure. It does not approve package extraction, cross-repo imports, Supabase changes, Netlify changes, public exposure, full Quote OS, pricing, proposals, procurement, payment, CRM or admin automation.

## Architecture Intent

Phase 7 should create a future-safe map for how Operon Bathrooms can align with broader Operon System concepts without forcing premature shared code.

The first useful shared layer is language, lifecycle and contract alignment. Runtime sharing should wait until the contracts prove stable inside Bathrooms and are reviewed against Flooring, Kitchens and any future Operon surfaces.

## Current Bathrooms-Local Sources

These remain the source of truth inside Operon Bathrooms:

- public estimate and intake routes
- quote review, request review and site measure flows
- bathroom chatbot routing and safety copy
- admin-lite lead workflow and manual review report foundations
- `BathroomDesignDraft`
- `BathroomDesignQuoteOsHandoff`
- local/staging Supabase migration files
- Design Studio stage gates and noindex/discovery controls

## Candidate Shared Domains

These domains may be candidates for future shared documentation or adapters:

- public language rules
- lead source attribution fields
- lead lifecycle status labels
- evidence-readiness status labels
- follow-up task lifecycle labels
- manual review section labels
- feature-flag and public-discovery vocabulary
- noindex and external-exposure gate language
- private-data boundary names
- QA checklist categories
- PR and gate-review workflow language

## Bathrooms-Local Domains

These must stay Bathrooms-local unless a later gate explicitly approves an adapter:

- bathroom estimate calculation
- bathroom quote review scoring
- bathroom-specific risk flags
- bathroom compliance prompts
- bathroom-specific evidence prompts
- Design Studio draft schema
- Design Studio Quote OS handoff contract
- bathroom manual review report prose
- bathroom Supabase table names and local migrations
- bathroom public SEO route structure

## Conceptual Layers

### Layer 1: Language And Safety

Purpose:

- Keep public wording consistent across Operon surfaces.
- Preserve planning guidance only, no final quote, no legal advice and no compliance certification.

Candidate outputs:

- shared wording glossary
- forbidden wording list
- public/private data boundary checklist

Implementation status:

- Documentation only.

### Layer 2: Lifecycle Vocabulary

Purpose:

- Align how leads, evidence, follow-ups and manual review states are named.
- Avoid incompatible status labels before any shared backend exists.

Candidate outputs:

- lead lifecycle vocabulary
- evidence-readiness vocabulary
- follow-up task vocabulary
- manual review section vocabulary

Implementation status:

- Documentation only.

### Layer 3: Contract Compatibility

Purpose:

- Identify which Bathrooms fields could later map into shared Operon contracts.
- Preserve Bathrooms-local schemas until an adapter is explicitly approved.

Candidate outputs:

- mapping notes from Bathrooms-local contracts to candidate shared names
- adapter readiness checklist
- versioning rules

Implementation status:

- Documentation only. No shared types or runtime adapter are approved.

### Layer 4: Infrastructure Readiness

Purpose:

- Define questions to answer before shared packages, Supabase schemas, Netlify config or service integrations are considered.

Candidate outputs:

- storage and migration readiness checklist
- feature-flag governance checklist
- rollback and audit checklist

Implementation status:

- Documentation only. No infrastructure change is approved.

## Future Adapter Shape

A future adapter, if approved later, should be one-way and conservative:

1. Read a Bathrooms-local object.
2. Select only allowlisted public or internal-safe fields.
3. Map to a versioned shared planning contract.
4. Reject forbidden pricing, supplier, SKU, margin, admin-note, scoring, secret, media or personal data fields.
5. Preserve a source marker such as `sourceSystem: "operon-bathrooms"`.
6. Require tests before any runtime use.

No adapter is implemented in this phase.

## Governance Rules

- Shared architecture starts as docs, not code.
- Bathrooms remains the only modified repo in this phase.
- Cross-repo work requires separate Vincent approval.
- Production Supabase and Netlify changes require separate approval.
- Public route discovery, sitemap inclusion and external exposure require separate approval.
- Full Quote OS remains locked.
- Pricing, proposals, procurement, payment, CRM and supplier/SKU integrations remain locked.

## Suggested Future Sequence

1. Approve this docs-only architecture map.
2. Optionally draft a shared glossary document.
3. Optionally draft a shared lifecycle vocabulary document.
4. Optionally draft an adapter-readiness checklist.
5. Pause before any runtime code, shared package, database or service integration.

## Gate Exit

This architecture map is ready when:

- the document is reviewed and merged
- stage status records the architecture map as docs-only
- next actions keep implementation locked
- local `git diff --check` passes

After this gate, the next safe task is a docs-only shared glossary. Implementation should remain locked until a later explicit approval.
