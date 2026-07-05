# Operon Bathroom Product Schedule Master Plan

## Current App Structure

Operon Bathrooms is a Next.js App Router application using React, TypeScript, Zod validation and node:test. Current
public routes cover bathroom planning estimates, quote review, request review, site measure, SEO service pages,
guides, privacy/terms and an internal noindex admin lead dashboard. Data capture currently uses local JSON fallback
storage with optional Supabase service-role writes where configured. Admin routes use `OPERON_BATHROOMS_ADMIN_TOKEN`.

There is no broad product catalogue, checkout, payment, supplier integration or ecommerce inventory layer. That is a
strength for this phase: the app can become an intelligence workflow before becoming a sales catalogue.

## Product Direction

Build Operon Bathroom Product Schedule: a guided product specification and PC allowance workflow for bathroom
renovation users. The tool helps homeowners, renovators, designers, builders and trades select product categories,
understand compliance prompts, check allowances and request a curated product pack or quote review.

The workflow should optimise for:

- Renovation lead capture.
- Product schedule generation.
- PC item allowance checking.
- Quote-review intelligence.
- Compliance-aware prompts.
- Trade workflow support.
- Future curated bathroom packs.
- Future supplier integration.
- Operon cross-sell into renovation, quote review and site measure.

It should not optimise for passive ecommerce, checkout, inventory or generic warehouse browsing.

## User Journeys

1. Homeowner planning a bathroom: enters bathroom type, size, vanity width, finish and budget, then receives a
   builder-ready product schedule.
2. Renovator comparing builder quote allowances: generates schedule and sees likely missing PC item categories or
   compliance prompts.
3. Builder/designer preparing a scope: uses the schedule as a structured conversation starter, not a final procurement
   document.
4. High-risk user: receives warnings around LED mirrors, wall-hung vanity support, non-standard timelines, strata,
   WELS/WaterMark and product categories that should move to consultation.
5. Product-pack lead: requests curated pack pricing without checkout or fixed-price claims.

## Phase Roadmap

### Phase 0 - Planning and Architecture

Create master planning docs, data model plan, AI workflow plan and implementation plan. Confirm current repo
architecture and use local typed data for the MVP.

### Phase 1 - Foundation MVP

Create `/product-schedule`, deterministic recommendation rules, local seed data, product pack recommendations,
builder-ready summary, allowance ranges, compliance notes, lead capture and a lightweight quote-text review helper.

### Phase 2 - Product Intelligence Depth

Expand rules for product substitution, product pack comparison, quote allowance parsing, WELS/WaterMark prompt depth
and builder-facing schedule export. Still no checkout.

### Phase 3 - Private Admin Workflow

Add admin review for product schedule leads, curated pack notes, follow-up status and internal product-fit tags.

### Phase 4 - Supplier Readiness

Add supplier/brand mapping and optional SKU candidates only after the intelligence workflow proves demand. Avoid
supplier APIs until governance and margin boundaries are approved.

### Phase 5 - Ecommerce Path

Consider curated pack quote requests, payment or checkout only for stable packs with clear fulfillment, warranty and
compliance boundaries. Broad ecommerce remains a later, optional path.

## Technical Architecture

- Framework: Next.js App Router.
- UI: existing CSS classes, cards, panels, form stacks and buttons.
- Validation: Zod.
- Product data: local typed seed objects in Phase 1.
- Storage: local JSON fallback for schedules/leads; future Supabase migration documented, not applied.
- AI abstraction: deterministic template functions now, later replaceable by provider-backed services.
- Analytics: local no-op/event utility now, future analytics destination later.

## Data Model

Phase 1 uses TypeScript types for `ProductCategory`, `Product`, `ProductRule`, `BathroomSchedule`,
`BathroomScheduleItem` and `Lead`. Future Supabase tables are documented in `BATHROOM_DATA_MODEL_PLAN.md` and should
not be applied until approved local/staging credentials and migrations are available.

## AI Workflow

AI is not required for Phase 1. Deterministic functions generate schedule summaries, explain recommendations, review
quote text and produce builder-ready summaries. Future LLM calls may sit behind these same function names without
exposing provider secrets or changing public safety boundaries.

## Risks

- Product guidance being mistaken for final product selection or compliance approval.
- PC allowance ranges being mistaken for final pricing.
- Supplier or margin logic leaking publicly.
- LED mirror, wall-hung vanity, heavy vanity and tapware finish risks being under-explained.
- Scope drift into checkout, inventory or supplier integrations too early.

## Kill Criteria

Pause or roll back if the workflow:

- Creates fixed-price or final-quote expectations.
- Requires live supplier APIs to be useful.
- Pushes users into unsuitable high-risk categories.
- Exposes margins, supplier costs, internal scoring or private rates.
- Becomes a generic bathroom ecommerce catalogue.
- Breaks existing estimate, quote-review, site-measure or admin flows.

## Future Ecommerce Path

Only consider ecommerce after the schedule workflow proves demand and after curated packs have known fulfillment,
warranty, compliance and margin controls. Checkout should start with narrow product packs, not a broad SKU warehouse.
