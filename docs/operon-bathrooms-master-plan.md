# Operon Bathrooms Master Plan

## Project Vision

Operon Bathrooms is a Sydney bathroom renovation planning and quote-clarity brand. The product helps homeowners understand planning estimate ranges, quote inclusions, risk flags and site-measure readiness before they move toward contract pricing.

The public promise is not a final online quote. The promise is clearer preparation: planning guidance, structured questions, compliance-aware prompts and a safer path to written scope confirmation.

## Operon System Context

Operon Bathrooms sits inside the broader Operon System pattern:

- Public SEO pages attract high-intent homeowners.
- Planning tools turn broad search intent into structured project data.
- Quote review and site-measure flows capture evidence and next-step readiness.
- Future admin and Quote OS layers should use the same language rules, risk prompts and source-of-truth project records.

This repo remains separate from Operon Flooring, Operon Kitchens and Oz Timber Floor.

## Customer Journey

1. Discover Operon through SEO pages such as cost, quote review, apartment bathroom or service pages.
2. Choose a path: start a planning estimate, review an existing quote, request scope review or prepare site measure.
3. Receive planning-only output: range, confidence score, assumptions, exclusions and risk prompts.
4. Prepare photos, quote documents, plans, selections and site constraints.
5. Move to site measure and written scope confirmation before contract pricing.

## Current Phase

Current focus: controlled local hardening of the public acquisition and qualification layer.

Phase 1 SEO, public lead flows, admin-lite, notification/response workflow, lead qualification,
manual review reporting and a rule-based chatbot are present locally. The next work should be QA,
security review, copy tightening and integration hardening before any later Quote OS foundation.

## Completed Work

- Next.js Operon Bathrooms app scaffold.
- Planning estimate wizard and result output.
- Public lead flows for quote review, request review and site measure.
- Admin-lite lead queue with token guard, filters, detail view, response workflow, internal notes and
  manual review queue views.
- Notification payload and customer acknowledgement templates that do not require email env vars for
  local build/test.
- Internal lead qualification model with private fit/risk/evidence fields.
- Internal manual review report generator with copy helpers.
- Rule-based bathroom chatbot that routes users to structured public flows.
- Basic sitemap, robots and metadata foundation.
- Local-only migration files from earlier phases.
- Phase 1 SEO documentation spine added in this planning pass.

## Strategic Constraints

- Keep public content focused on planning guidance and quote clarity.
- Do not expose internal rates, supplier costs, labour rates, margins, admin notes, private scoring logic or rate cards.
- Do not imply guaranteed compliance or guaranteed price certainty.
- Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing.
- Avoid broad competitive SEO until authority pages and high-intent pages have traction.

## Public Language Rules

- Planning guidance only.
- No final quote wording.
- No legal advice.
- No guaranteed compliance.
- No fixed-price promise.
- No "free final quote online" positioning.
- No "cheap bathroom renovation" positioning.
- NSW compliance prompts may reference licence, deposit and HBC/HBCF thresholds, but must not give legal advice.

## Repo Boundaries

- Work only inside the Operon Bathrooms repo/app.
- Do not touch Operon Flooring.
- Do not touch Operon Kitchens.
- Do not touch Oz Timber Floor.
- Do not modify production Supabase settings.
- Do not modify production Netlify settings.
- Do not deploy from local implementation tasks.
- Do not push to main from implementation tasks.

## Do Not Build Yet

- Full Quote OS.
- SaaS, marketplace, payment, 3D design, procurement or CRM.
- Thin suburb pages.
- Legal advice content.
- Emergency repair or supply-only fixture funnels.
- Production Supabase or Netlify changes from local implementation tasks.
- Public manual review reports or customer proposals.

## Phase Roadmap

### Phase 1 Public SEO + Quote Wizard

Build high-intent long-tail pages, metadata, sitemap, robots and internal links. Keep the quote wizard planning-only and CTA-led.

### Phase 2 Lead Capture + Quote Review

Harden quote review, request review and site-measure capture with attribution, structured payloads and safe server-side storage.

### Phase 3 Admin-Lite

Create a restricted internal view for incoming bathroom leads, statuses and manual triage.

### Phase 3a Notification/Response

Prepare safe notification payloads and customer response templates without requiring email configuration during local builds.

### Phase 3b Lead Qualification/Manual Review

Add internal fit, risk and priority signals. Keep scoring private.

### Phase 4 Chatbot

Maintain the guarded rule-based chatbot. Do not add paid AI/API behavior until public safety,
attribution and lead handoff requirements are approved.

### Phase 5 Manual Review Report Generator

Generate internal structured quote/scope review reports from qualified lead evidence. Keep reports
admin-only and never treat them as public proposals.

### Phase 6 Bathroom Quote OS Foundation

Model written scope, selections, trades, exclusions, assumptions and review evidence as a structured operating system.

### Phase 7 Shared Operon System Infrastructure

Unify reusable infrastructure only when multiple Operon brands need the same stable capability.
