# Phase 7 Adapter-Readiness Checklist

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only adapter-readiness checklist for Phase 7 Shared Operon System Infrastructure.

It does not implement an adapter. It does not approve shared packages, cross-repo imports, database schemas, API routes, background jobs, analytics events, workflow automation, Supabase changes, Netlify changes, public exposure or Quote OS implementation.

## Readiness Intent

The checklist defines what must be true before a future Operon shared adapter can be considered.

The safest first adapter, if later approved, would be a one-way, allowlisted mapper from Bathrooms-local planning context into a future shared Operon planning contract. It must preserve Bathrooms as the source of truth and reject unsafe data by default.

## Candidate Source Contracts

Any future adapter review must identify the exact source contract before implementation.

Current Bathrooms-local candidates:

- `BathroomDesignDraft`
- `BathroomDesignQuoteOsHandoff`
- public planning estimate summary context
- quote review public clarity result context
- evidence-readiness checklist context
- internal manual review section labels
- lead source attribution fields
- lifecycle labels documented in `PHASE_7_LIFECYCLE_VOCABULARY_2026-06-28.md`

These remain Bathrooms-local until a later implementation gate explicitly approves a versioned adapter.

## Required Adapter Questions

Before implementation, answer:

- What source object is being adapted?
- What destination contract exists, and is it versioned?
- Is the adapter one-way only?
- Which fields are explicitly allowlisted?
- Which fields are explicitly rejected?
- Does the adapter preserve `sourceSystem: "operon-bathrooms"` or equivalent provenance?
- Does the adapter preserve source schema version and handoff version where available?
- Does the adapter avoid personal contact data unless a later internal-only gate approves it?
- Does the adapter avoid public bundle exposure of internal-only data?
- Does the adapter have rollback criteria?
- Does the adapter require local-only, staging-only or production verification before use?
- Does the adapter require changes outside Operon Bathrooms?

If any answer is unclear, implementation must stay locked.

## Allowlist Principles

Future adapter allowlists may include only fields that are necessary, bounded and safe for the approved destination.

Potentially safe field categories:

- source system marker
- source route or source flow label
- schema version
- handoff version
- bathroom type
- preferred next step
- public lifecycle label
- public evidence-readiness counts
- public prompt IDs
- public risk prompt categories
- feature-flag or discovery-gate state labels
- planning-only trust labels

Potentially safe does not mean automatically approved. Each field still requires explicit review in the implementation gate.

## Mandatory Reject List

Any future adapter must reject:

- internal rate cards
- supplier costs
- labour rates
- margins
- final prices
- fixed-price claims
- private scoring or qualification logic
- admin notes
- service-role keys
- access tokens
- secrets
- live supplier feeds
- confirmed SKUs
- product availability checks
- procurement or ordering data
- payment data
- uploaded media
- image blobs
- base64 image data
- EXIF data
- personal contact data unless separately approved for an internal-only path
- legal advice
- compliance certification
- waterproofing certification
- quote approval or rejection labels
- measured CAD or construction documentation claims

## Public-Language Safety Checks

Any future adapter output that could influence public or customer-facing text must preserve:

- planning guidance only
- no final quote wording
- no fixed-price promise
- no legal advice
- no guaranteed compliance
- no online waterproofing, strata, plumbing or electrical confirmation
- site measure required before contract pricing
- selections required before contract pricing
- licensed-trade checks required before contract pricing
- written scope confirmation required before contract pricing

## Versioning Requirements

A future adapter must be versioned if it:

- maps from more than one source contract
- changes field names or lifecycle labels
- changes public/private data boundaries
- introduces any shared destination shape
- could be consumed by another Operon surface later

Versioning must include:

- adapter name
- adapter version
- source contract name
- source contract version
- destination contract name
- destination contract version
- changelog entry
- rollback note

## Test Requirements For Later Implementation

A future implementation PR must include:

- unit tests for valid allowlisted mapping
- unit tests for rejected private pricing and rate markers
- unit tests for rejected supplier, SKU and procurement markers
- unit tests for rejected personal/contact fields unless separately approved
- unit tests for public-language safety boundaries
- tests for version and provenance preservation
- bundle-safety scan if any client code is touched
- route/discovery checks if any public surface is touched
- local build if runtime code changes

Documentation-only updates need only `git diff --check` and boundary grep.

## Rollback Criteria

Any future adapter must be reversible by:

- disabling the consuming feature flag
- ignoring the adapted payload
- continuing to use Bathrooms-local source contracts directly
- preserving already submitted leads without migration
- leaving public routes, sitemap and noindex behavior unchanged unless separately approved

If rollback requires production Supabase, production Netlify, cross-repo deployment or data backfill, implementation is not ready.

## Approval Gates

Before a future adapter can be implemented, Vincent must separately approve:

1. the exact source and destination contracts
2. the allowlist and reject list
3. whether the adapter is internal-only or can affect public copy
4. the test plan
5. any local/staging verification requirements
6. any cross-repo review requirement

This checklist approval does not approve any of those implementation steps.

## Gate Exit

This adapter-readiness checklist is ready when:

- this document is reviewed and merged
- stage status records the checklist as docs-only
- next actions keep implementation locked
- local `git diff --check` passes

After this gate, the next safe action is to pause Phase 7 or draft a docs-only contract field inventory. Implementation should remain locked until a later explicit approval.
