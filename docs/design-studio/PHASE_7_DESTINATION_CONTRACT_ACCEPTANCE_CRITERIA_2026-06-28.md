# Phase 7 Destination Contract Acceptance Criteria

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only destination contract acceptance criteria document for Phase 7 Shared Operon System Infrastructure.

It defines what a future shared destination contract must satisfy before any adapter implementation can be considered. It does not implement a destination contract, shared type, shared package, shared schema, adapter, API route, database enum, Supabase migration, Netlify change, analytics pipeline, cross-repo import, public exposure change or Quote OS workflow.

## Destination Intent

The first future destination contract, if later approved, should receive a minimal, planning-only context from Operon Bathrooms.

It should not be a generic lead object, proposal object, CRM object, pricing object, procurement object or public Quote OS output.

## Candidate Contract Name

Preferred candidate name:

- `OperonPlanningContext`

Allowed alternatives if later reviewed:

- `OperonSharedPlanningContext`
- `OperonDesignPlanningHandoff`

Rejected names for the first destination contract:

- `Quote`
- `Proposal`
- `Contract`
- `Order`
- `Customer`
- `CRMLead`
- `ProductSelection`
- `ProcurementRequest`

Names must not imply final quote, contract pricing, product ordering, customer account creation or CRM automation.

## Minimum Required Fields

A future destination contract must include:

- `contractName`
- `contractVersion`
- `sourceSystem`
- `sourceFlow`
- `sourceSchemaVersion`
- `sourceHandoffVersion`
- `createdAt`
- `planningGuidanceOnly`
- `requiresSiteMeasureConfirmation`
- `requiresSelectionsConfirmation`
- `requiresLicensedTradeChecks`
- `requiresWrittenScopeConfirmation`
- `safety`

The `safety` object must explicitly keep these false:

- `finalPricing`
- `fixedPrice`
- `quoteApproval`
- `proposalOutput`
- `contractReady`
- `procurement`
- `payment`
- `crmAutomation`
- `publicOutput`
- `complianceCertification`
- `legalAdvice`
- `supplierData`
- `skuData`

## Optional First-Pass Fields

The first destination contract may include only these optional planning fields after separate approval:

- `projectRoomType`
- `preferredNextStep`
- `finishLevelBand`
- `photoUsedFlag`
- `layoutPlanningBands`
- `planningConstraintFlags`
- `layoutRiskPromptIds`
- `constraintPromptIds`
- `evidenceSummary`
- `evidenceItemIdsByStatus`

Optional fields must remain bounded and non-identifying.

## Explicitly Excluded Fields

The first destination contract must exclude:

- contact details
- personal free text
- uploaded files or media
- image blobs
- base64 data
- object URLs
- EXIF data
- raw draft payloads
- full prompt copy
- fixture-zone notes
- exact measurements
- measured plans
- CAD or construction drawing data
- product SKUs
- supplier names or supplier feeds
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

## Source Contract Requirement

The preferred first source remains:

- `BathroomDesignQuoteOsHandoff`

The destination criteria do not approve mapping from raw `BathroomDesignDraft`.

Raw draft mapping requires a separate approval because it carries broader UI state and copy fields.

## Versioning Criteria

The destination contract must be versioned before implementation.

Versioning must include:

- semver-like contract version
- source compatibility statement
- changelog entry
- migration note, even if no migration is required
- rollback note
- owner and reviewer names or roles

Any field addition, field removal, meaning change, safety flag change or public/private boundary change requires a version decision.

## Public-Language Criteria

Any destination field that could influence public copy must preserve:

- planning guidance only
- no final quote
- no fixed-price promise
- no legal advice
- no compliance certification
- no online waterproofing confirmation
- no online plumbing or electrical confirmation
- no online strata or Class 2 determination
- site measure required before contract pricing
- selections required before contract pricing
- licensed-trade checks required before contract pricing
- written scope confirmation required before contract pricing

## Privacy Criteria

The first destination contract must be non-identifying by default.

Before any identifying field is considered, a separate internal-only privacy gate must define:

- why the field is needed
- where it is stored
- who can read it
- whether it can enter a client bundle
- how it is removed or ignored during rollback
- what tests prove it is not publicly exposed

## Test Criteria For Later Implementation

A later implementation PR must include tests proving:

- required fields are present
- safety flags are present and false where required
- version and source provenance are preserved
- optional fields are bounded
- rejected field names cannot pass
- rejected string markers cannot pass
- private pricing, supplier, SKU, procurement and payment fields cannot pass
- media, base64, object URLs, EXIF and upload markers cannot pass
- legal/compliance/final quote wording cannot pass
- public-language requirements are preserved
- client bundle scan passes if client code is touched
- route/noindex/discovery checks pass if public surfaces are touched

## Rollback Criteria

A future destination contract implementation is not acceptable unless rollback can:

- disable adapter use behind a feature flag or internal gate
- continue using Bathrooms-local contracts directly
- ignore destination payloads without migrating existing leads
- preserve `/design-studio` noindex behavior
- preserve public discovery settings
- avoid production Supabase or Netlify changes unless separately approved
- avoid cross-repo deployment unless separately approved

## Acceptance Gate

Before implementation, Vincent must separately approve:

1. final destination contract name
2. destination contract version
3. required fields
4. optional fields
5. rejected fields and string markers
6. source contract
7. test plan
8. runtime location
9. feature flag or internal gate
10. local/staging verification plan

This document does not approve any implementation.

## Gate Exit

This destination contract acceptance criteria document is ready when:

- this document is reviewed and merged
- stage status records it as docs-only
- next actions keep implementation locked
- local `git diff --check` passes

After this gate, the safest action is to pause Phase 7 or draft a docs-only implementation gate checklist. Implementation should remain locked until a later explicit approval.
