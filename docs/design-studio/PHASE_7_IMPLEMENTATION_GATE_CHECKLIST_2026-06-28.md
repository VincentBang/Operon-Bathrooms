# Phase 7 Implementation Gate Checklist

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only implementation gate checklist for Phase 7 Shared Operon System Infrastructure.

It defines the final preflight checks that must pass before any future Phase 7 implementation can be considered. It does not approve implementation and does not add adapter code, shared types, shared packages, shared schemas, API routes, database enums, Supabase migrations, Netlify changes, analytics pipelines, cross-repo imports, public exposure changes or Quote OS workflows.

## Gate Purpose

This checklist prevents documentation planning from quietly becoming runtime work.

Any future implementation branch must start only after Vincent separately approves:

- the implementation scope
- the exact source contract
- the exact destination contract
- the exact field allowlist
- the exact reject list
- the runtime location
- the test plan
- the rollback path

## Required Prior Docs

Before implementation can be considered, these docs must be merged and current:

- `PHASE_7_ACCEPTANCE_CRITERIA.md`
- `PHASE_7_SHARED_ARCHITECTURE_MAP_2026-06-28.md`
- `PHASE_7_SHARED_GLOSSARY_2026-06-28.md`
- `PHASE_7_LIFECYCLE_VOCABULARY_2026-06-28.md`
- `PHASE_7_ADAPTER_READINESS_CHECKLIST_2026-06-28.md`
- `PHASE_7_CONTRACT_FIELD_INVENTORY_2026-06-28.md`
- `PHASE_7_ADAPTER_DECISION_PACKET_2026-06-28.md`
- `PHASE_7_DESTINATION_CONTRACT_ACCEPTANCE_CRITERIA_2026-06-28.md`

If any of these are stale, update docs first. Do not begin implementation.

## Implementation Scope Must Be Narrow

The first possible implementation, if later approved, must be limited to one of these:

- a local-only adapter prototype behind tests only
- an internal-only adapter function not imported by public routes
- a non-runtime type draft used only in tests

Anything broader requires a separate phase decision.

Not allowed in the first implementation gate:

- shared package extraction
- npm publishing
- monorepo restructuring
- cross-repo imports
- production Supabase changes
- production Netlify changes
- public route changes
- sitemap, robots, nav or footer changes
- public indexing changes
- analytics pipeline activation
- admin automation
- CRM workflow
- procurement workflow
- payment workflow
- public Quote OS output

## Source Contract Gate

The approved source must be named before implementation.

Preferred first source:

- `BathroomDesignQuoteOsHandoff`

Rejected unless separately approved:

- raw `BathroomDesignDraft`
- full lead payloads
- uploaded media payloads
- manual review reports
- admin notes
- contact details
- rate cards
- supplier data
- SKU data

## Destination Contract Gate

The approved destination must be named and versioned before implementation.

Preferred first destination candidate:

- `OperonPlanningContext`

The destination must include:

- `contractName`
- `contractVersion`
- `sourceSystem`
- `sourceFlow`
- `sourceSchemaVersion`
- `sourceHandoffVersion`
- `planningGuidanceOnly`
- `requiresSiteMeasureConfirmation`
- `requiresSelectionsConfirmation`
- `requiresLicensedTradeChecks`
- `requiresWrittenScopeConfirmation`
- required safety flags

The destination must not imply final quote, proposal, contract, order, customer account, CRM lead, procurement request or payment flow.

## Allowlist Gate

The implementation PR must list the exact allowlisted fields in the PR body and tests.

First-pass allowlist should be limited to:

- source markers
- version markers
- bathroom type
- preferred next step
- finish-level planning band
- photo-used boolean
- approximate layout bands
- boolean planning constraint flags
- prompt IDs
- evidence counts
- evidence item IDs by status
- site-measure-required flag
- planning-guidance-only flag
- safety flags

No field may be added because it is convenient. Every field needs a documented reason.

## Reject Gate

The implementation PR must prove these cannot pass:

- contact details
- personal free text
- uploaded media
- image blobs
- base64 data
- object URLs
- EXIF data
- raw draft payloads
- full prompt copy
- fixture-zone notes
- exact measurements
- CAD or construction drawing data
- product SKUs
- supplier feeds
- product availability
- procurement data
- ordering data
- payment data
- internal rate cards
- supplier costs
- labour rates
- margins
- estimate calculation logic
- private scoring or qualification logic
- admin notes
- service-role keys
- access tokens
- secrets
- legal advice
- compliance certification
- waterproofing certification
- quote approval or rejection labels
- public proposal copy
- final quote wording

## Runtime Location Gate

Before implementation, decide whether the adapter may exist in:

- test-only code
- server/internal-only code
- client code

Default recommendation:

- start test-only or server/internal-only

Client code requires a stricter bundle-safety scan and a separate reason because shared planning contracts can accidentally expand public bundle exposure.

## Feature Flag Gate

If the adapter can be invoked at runtime, it must be behind an internal gate or feature flag.

The gate must default to off and must not:

- enable public discovery
- change `/design-studio` noindex behavior
- add sitemap entries
- add nav or footer links
- trigger Netlify deploy settings
- require production Supabase changes

## Test Gate

A future implementation PR must pass:

- focused unit tests for successful mapping
- focused unit tests for rejected fields
- focused unit tests for rejected string markers
- version/provenance preservation tests
- public-language safety tests
- private-pricing rejection tests
- supplier/SKU/procurement/payment rejection tests
- media/base64/EXIF/upload rejection tests
- bundle-safety scan if client code is touched
- local typecheck
- local test suite or focused suite plus documented reason
- local build if runtime code is touched

## Rollback Gate

Rollback must be possible without:

- data migration
- production Supabase change
- production Netlify change
- cross-repo deployment
- public route removal
- public content correction
- customer-facing communication

If rollback requires any of those, implementation is not ready.

## Review Gate

Before implementation starts, the PR or task brief must state:

- exact implementation scope
- files expected to change
- files explicitly not allowed to change
- source contract
- destination contract
- allowlist
- reject list
- tests
- rollback plan
- confirmation that Phase 7 remains internal-only unless separately approved

## Explicit Non-Approval

This checklist does not approve:

- writing adapter code
- exporting shared TypeScript types
- creating a shared package
- creating a runtime schema
- changing `BathroomDesignDraft`
- changing `BathroomDesignQuoteOsHandoff`
- touching Operon Flooring
- touching Operon Kitchens
- touching Oz Timber Floor
- adding Supabase migrations
- modifying Netlify config
- changing public routes, navigation, footer, sitemap or robots
- changing `/design-studio` noindex behavior
- implementing shared analytics
- enabling public Quote OS output
- enabling pricing, proposal, procurement, payment or CRM workflows

## Gate Exit

This implementation gate checklist is ready when:

- this document is reviewed and merged
- stage status records it as docs-only
- next actions keep implementation locked
- local `git diff --check` passes

After this gate, the safest action is to pause Phase 7. Any implementation must be separately approved with a narrow scope.
