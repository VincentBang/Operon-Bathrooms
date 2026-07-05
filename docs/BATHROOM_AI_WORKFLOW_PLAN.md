# Operon Bathroom Product Schedule AI Workflow Plan

## Phase 1 AI Boundary

No external AI provider is used in Phase 1. No API keys are added. All generated copy uses deterministic templates so
the workflow is safe, testable and consistent with planning-guidance-only public language.

## Abstraction Functions

The app should expose these functions as the stable seam for future AI:

- `generateBathroomScheduleSummary(input, scheduleItems)`
- `explainBathroomRecommendation(input, product)`
- `reviewBathroomQuoteText(text)`
- `generateBuilderReadyBathroomSchedule(schedule)`
- `checkBathroomComplianceNotes(scheduleItems)`

In Phase 1 these functions return deterministic text. Later they can call an LLM behind server-side boundaries.

## Future AI Roles

- Vanity Selector Agent: recommend vanity category, width and support prompts.
- Basin Selector Agent: check basin type, tap holes and vanity compatibility.
- Tapware Selector Agent: flag WaterMark/WELS and finish-care risks.
- Mirror Selector Agent: flag LED electrical and warranty risks.
- Product Schedule Generator Agent: produce builder-ready schedule summaries.
- PC Allowance Checker Agent: compare builder quote text against product schedule allowances.
- Quote Review Assistant: flag missing product categories, vague PC items and unrealistic allowances.
- Product Substitution Agent: suggest like-for-like alternatives.
- Supplier Comparison Agent: compare supplier candidate sets after governance approval.
- Compliance Note Agent: produce safe WaterMark/WELS/electrical prompts without legal advice.

## Allowed Answers

AI-assisted output may:

- Explain why a product category fits a project.
- Summarise allowance ranges.
- Flag missing categories or unclear quote lines.
- Ask for photos, quote details or site-measure confirmation.
- Route to quote review, product pack quote or Operon consultation.

## Forbidden Answers

AI-assisted output must not:

- Provide final pricing.
- Guarantee compliance.
- Give legal advice.
- Claim a product is suitable without site and trade checks.
- Expose supplier costs, margins, private scoring, internal notes or rate cards.
- Create checkout or payment decisions.
- Recommend direct import or unbranded tapware.

## Quote Review Text Plan

The Phase 1 quote review helper flags:

- Missing vanity allowance.
- Missing basin allowance.
- Missing tapware allowance.
- Missing mirror or shaving cabinet.
- Missing accessories.
- Unclear shower screen allowance.
- Unclear toilet allowance.
- No WELS/WaterMark mention.
- Vague PC item line.
- Unrealistic low allowance.
- No installation exclusion notes.
- No waterproofing or tiling interface notes.

## Handoff Paths

Future AI should route users to:

- `/product-schedule` for schedule generation.
- `/quote/review` for existing builder quote review.
- `/request-review` for early scope review.
- `/site-measure` for site confirmation.

## Phase 2 Deterministic Intelligence

Phase 2 adds more intelligence without external AI:

- Substitution suggestions are rule-based category alternatives.
- Product-pack comparison uses deterministic fit and allowance-alignment labels.
- Quote allowance review extracts visible allowance amounts from pasted text only.
- Builder export is generated from the public schedule result and keeps planning-only language.

Future LLM use can improve wording, quote classification and substitution explanations, but only behind
server-side boundaries with deterministic fallback and the same forbidden-answer rules.

## Safety Controls

- Provider keys server-side only.
- Deterministic fallback required.
- Tests for forbidden pricing/compliance language.
- No customer-visible chain of thought or internal scoring.
- No supplier/margin data in public responses.
