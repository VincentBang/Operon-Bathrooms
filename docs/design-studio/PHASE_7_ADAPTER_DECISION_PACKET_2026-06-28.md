# Phase 7 Adapter Decision Packet

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only adapter decision packet for Phase 7 Shared Operon System Infrastructure.

It records the recommended future adapter source, destination assumptions, approval gates and non-implementation boundary. It does not implement an adapter, shared type, shared package, shared schema, database enum, API route, analytics pipeline, Supabase migration, Netlify change, cross-repo import, public exposure change or Quote OS workflow.

## Decision To Record

If Vincent later approves a Phase 7 adapter implementation, the first candidate should start from `BathroomDesignQuoteOsHandoff` rather than raw `BathroomDesignDraft`.

Decision status: recommended, not implemented.

## Recommended Source

Recommended source contract:

- `BathroomDesignQuoteOsHandoff`
- current handoff version: `0.1`
- derived from `BathroomDesignDraft` schema version `0.5`
- internal-only
- already allowlisted
- already strips fixture-zone notes
- already strips full prompt copy down to IDs where possible
- already summarises evidence readiness as counts and item IDs
- already carries safety flags that keep pricing, proposals, procurement, payment, CRM, admin automation and public output false

## Why Not Start From Raw Draft

`BathroomDesignDraft` remains the browser-local source of truth, but it is a broader UI planning object.

Starting from raw draft would require more adapter filtering because it includes:

- local UI state
- local style and palette taxonomy IDs
- local variant IDs
- full prompt titles and messages
- evidence labels and prompt copy
- fixture-zone notes
- richer catalogue candidate context
- timestamps and draft IDs that need a privacy decision

These fields are useful inside Bathrooms but are not ready to become a shared contract surface.

## Candidate Destination

No destination contract is approved yet.

If implementation is later approved, use a new destination contract name such as:

- `OperonPlanningContext`
- `OperonSharedPlanningContext`
- `OperonDesignPlanningHandoff`

The destination must be versioned before runtime use.

Minimum destination requirements:

- `sourceSystem: "operon-bathrooms"`
- `sourceFlow: "design-studio"`
- source schema version
- source handoff version
- planning-only safety flags
- no final pricing
- no public proposal output
- no supplier, SKU, procurement, payment or CRM data
- no media or personal contact data
- no legal or compliance certification
- no public route discovery or indexing side effect

## Initial Allowlist Direction

A later implementation gate may consider only these categories first:

- source system and flow markers
- source schema and handoff versions
- bathroom type
- preferred next step
- finish-level planning band
- photo-used boolean
- approximate layout bands
- boolean planning constraint flags
- prompt IDs, not full copy
- evidence counts and evidence item IDs by status
- site-measure-required flag
- planning-guidance-only flag
- safety flags confirming no pricing, proposal, procurement, payment, CRM, admin automation or public output

This is not an implemented allowlist.

## Fields To Keep Out Of The First Adapter

Do not include in the first adapter:

- raw `BathroomDesignDraft`
- full Design Studio variant objects
- full local style or palette objects
- full prompt titles or messages
- evidence prompt copy
- fixture-zone notes
- local template IDs unless a shared taxonomy is approved
- local product shortlist labels unless a shared selection vocabulary is approved
- draft IDs unless a non-identifying reference policy is approved
- timestamps unless an internal audit use case is approved
- contact details
- uploaded media
- free-text user notes
- internal review notes
- private scores
- pricing logic
- supplier data
- SKU data
- procurement data
- Quote OS proposal data

## Required Implementation Gates

Before any code is written, Vincent must separately approve:

1. destination contract name
2. destination contract version
3. exact field allowlist
4. exact reject tests
5. whether source IDs and timestamps are allowed
6. whether the adapter is internal-only or can affect public copy
7. whether the adapter may live in client code or must be server/internal only
8. local test plan
9. staging verification plan if any data leaves browser/session context
10. cross-repo review plan if another Operon surface may consume it

## Required Tests For Later Implementation

A later implementation PR must include:

- unit tests proving only allowlisted fields are mapped
- unit tests proving rejected fields are stripped or rejected
- unit tests for version and provenance preservation
- unit tests proving pricing, supplier, SKU, procurement, payment and private score markers cannot pass
- unit tests proving media, base64, object URLs, EXIF and upload markers cannot pass
- unit tests proving public-language safety flags are preserved
- bundle-safety scan if any client code is touched
- local build if runtime code changes
- route/noindex/discovery check if any public surface is touched

## Explicit Non-Approval

This decision packet does not approve:

- writing adapter code
- exporting shared TypeScript types
- creating a shared package
- changing `BathroomDesignDraft`
- changing `BathroomDesignQuoteOsHandoff`
- adding Supabase migrations
- modifying Netlify config
- changing public routes, navigation, footer, sitemap or robots
- changing `/design-studio` noindex behavior
- connecting another Operon repo
- implementing shared analytics
- enabling public Quote OS output
- enabling pricing, proposal, procurement, payment or CRM workflows

## Recommended Next Gate

After this packet is reviewed and merged, the safest next action is to pause Phase 7 or draft a docs-only destination contract acceptance criteria document.

Implementation should remain locked until a later explicit approval.

## Gate Exit

This decision packet is ready when:

- this document is reviewed and merged
- stage status records the packet as docs-only
- next actions keep implementation locked
- local `git diff --check` passes
