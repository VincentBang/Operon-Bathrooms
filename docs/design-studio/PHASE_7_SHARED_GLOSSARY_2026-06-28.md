# Phase 7 Shared Glossary

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only glossary for Phase 7 Shared Operon System Infrastructure.

It defines shared language candidates for future Operon System alignment. It does not implement shared types, shared packages, adapters, database schemas, API routes, UI components, analytics events or service integrations.

## Glossary Principles

- Use language that is plain enough for public pages and precise enough for internal review.
- Preserve Bathrooms-local source-of-truth contracts until a later adapter is explicitly approved.
- Treat shared terms as vocabulary, not runtime schemas.
- Keep planning guidance separate from contract pricing.
- Keep public guidance separate from admin-only review notes.
- Keep readiness prompts separate from certification or approval.

## Core Public Terms

| Term | Safe meaning | Do not use to mean |
|---|---|---|
| Planning guidance | A non-binding estimate, explanation, checklist or next-step prompt. | Final quote, fixed price, contract price or approved scope. |
| Planning estimate | A public range or confidence-oriented estimate for early planning. | A builder quote, contract offer or guaranteed price. |
| Quote review | A structured review of an existing quote for clarity, inclusions, exclusions and risk prompts. | A legal finding, builder accusation, quote approval or price certification. |
| Request review | A request for human scope review when a user has photos, plans, ideas or incomplete quote context. | A final proposal request or contract-pricing request. |
| Site measure | A site visit or inspection step used to confirm conditions, access, selections and written scope. | A guarantee that all compliance, waterproofing, strata or service conditions are certified online. |
| Written scope confirmation | A documented scope that follows site checks, selections and licensed-trade review. | Public chatbot advice, online estimate output or preliminary Design Studio summary. |
| Contract pricing | Pricing that can only follow site measure, selections, licensed-trade checks and written scope confirmation. | Online calculator output, Design Studio handoff or planning estimate. |

## Design Studio Terms

| Term | Safe meaning | Do not use to mean |
|---|---|---|
| Design Studio | A planning and evidence-preparation surface inside Operon Bathrooms. | CAD, construction documentation, final quoting or professional design certification. |
| Inspiration visual | A visual planning aid or style prompt. | Verified render, measured drawing or product specification. |
| Approximate planning layout | A bounded layout concept using approximate room and fixture-zone choices. | Measured plan, CAD drawing, construction drawing or build-ready set-out. |
| Catalogue candidate | A governed local planning candidate for preference capture. | Verified SKU, live supplier feed, availability check or procurement item. |
| Evidence readiness | A checklist showing whether useful photos, notes or documents are prepared for review. | Uploaded evidence, verified measurements, compliance proof or site condition confirmation. |
| Constraint prompt | A deterministic planning prompt based on bounded user selections. | AI recommendation, legal advice, compliance certification or final scope instruction. |
| Design handoff | An allowlisted transfer of planning context to another internal or existing flow. | Public proposal, quote approval, pricing engine or procurement request. |

## Lead And Review Terms

| Term | Safe meaning | Do not use to mean |
|---|---|---|
| Lead source | Where the enquiry or handoff originated, such as quote wizard, quote review, chatbot or Design Studio. | User identity verification or paid attribution guarantee. |
| Lead lifecycle | The broad state of an enquiry, such as new, reviewing, awaiting evidence or ready for site measure. | CRM automation, sales commitment or contract stage. |
| Follow-up task | An internal prompt to request information or route the next human action. | Automated sales sequence, guaranteed appointment or external promise. |
| Manual review | Internal human preparation using structured context. | Public proposal, final quote, legal advice or compliance certification. |
| Review question | A safe question to clarify before scope confirmation. | A defect finding, legal conclusion or demand. |
| Risk flag | A prompt that a topic needs clarification, written confirmation or site review. | Proof of non-compliance, guaranteed variation or builder misconduct. |

## Private Boundary Terms

| Term | Safe meaning | Do not use to mean |
|---|---|---|
| Internal-only | May be used by Operon staff or protected admin workflows, not public pages. | Hidden data that can safely leak to public bundles. |
| Private pricing | Rate cards, supplier costs, labour rates, margins or pricing logic. | Public planning ranges or customer-facing estimate summaries. |
| Admin note | Internal operational context for review or follow-up. | Public customer advice, proposal wording or quote report content. |
| Private score | Internal prioritisation or qualification logic. | Public confidence score, public clarity score or customer-facing risk flag. |
| Service key | Secret token, service-role credential or privileged API key. | Public anon key, public route name or non-secret config label. |

## Shared Infrastructure Terms

| Term | Safe meaning | Do not use to mean |
|---|---|---|
| Shared contract | A future agreed shape or adapter vocabulary that may align Operon surfaces. | An implemented package, database schema or runtime dependency. |
| Adapter | A future one-way mapper from a local source object to an approved shared contract. | Live integration, data sync, cross-repo import or public API. |
| Shared glossary | Documentation vocabulary that can be reused by humans across repos. | Source code, npm package or enforced schema. |
| Shared architecture map | Documentation explaining possible future layers and boundaries. | Implementation plan approval or infrastructure deployment. |
| Feature flag | A controlled runtime switch. | Public launch approval, sitemap inclusion or SEO discovery approval. |
| Public discovery | Navigation, sitemap, public links or indexable exposure. | A route merely existing behind a flag or noindex mode. |

## Forbidden Shared Meanings

Do not let any shared term imply:

- final quote
- fixed price
- contract price
- quote approval
- legal advice
- waterproofing certification
- compliance certification
- verified SKU
- live supplier availability
- procurement readiness
- payment readiness
- CRM automation
- admin automation
- public proposal generation
- measured CAD
- construction documentation
- production AR or camera capture

## Bathrooms-Local Term Overrides

These terms stay Bathrooms-local unless later approved:

- `BathroomDesignDraft`
- `BathroomDesignQuoteOsHandoff`
- bathroom estimate range
- bathroom confidence score
- bathroom quote clarity score
- bathroom risk flags
- bathroom compliance prompts
- bathroom manual review report
- bathroom Supabase migration names

## Future Use

This glossary may later support:

- public-language reviews
- manual review templates
- event naming discussions
- adapter-readiness planning
- shared QA checklists

It must not be treated as an implemented schema or shared package.
