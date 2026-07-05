# Operon Bathroom Product Schedule Implementation Plan

## Phase 1 Scope

Build the first guided Bathroom Product Schedule workflow without checkout, payment, supplier APIs, external AI,
production Supabase changes or production Netlify changes.

## Files To Create

- `app/product-schedule/page.tsx`
- `app/api/product-schedule/route.ts`
- `components/ProductScheduleForm.tsx`
- `data/product-schedule/bathroom-products.ts`
- `lib/product-schedule.ts`
- `lib/product-schedule-ai.ts`
- `lib/product-schedule-store.ts`
- `lib/product-schedule-analytics.ts`
- `tests/product-schedule.test.ts`
- `docs/BATHROOM_MASTER_PLAN.md`
- `docs/BATHROOM_IMPLEMENTATION_PLAN.md`
- `docs/BATHROOM_DATA_MODEL_PLAN.md`
- `docs/BATHROOM_AI_WORKFLOW_PLAN.md`

## Files To Modify

- `app/layout.tsx` for navigation/footer links.
- `app/page.tsx` for homepage entry point.
- `app/sitemap.ts` for `/product-schedule`.
- `tests/pages.test.tsx` for page render coverage.

## Components

- `ProductScheduleForm`: guided inputs, lead capture and result rendering.
- Product schedule preview inside the form result state.
- Quote-review and product-pack CTAs in result output.

## API Routes

- `POST /api/product-schedule`
  - Validate input.
  - Generate deterministic schedule.
  - Store schedule and optional lead locally.
  - Return safe schedule result with no internal margin or supplier-cost data.

## Server/Library Functions

- `generateBathroomProductSchedule(input)`
- `calculatePcAllowanceRange(input, items)`
- `reviewBathroomProductQuoteText(text)`
- `generateBathroomScheduleSummary(input, scheduleItems)`
- `explainBathroomRecommendation(input, product)`
- `generateBuilderReadyBathroomSchedule(schedule)`
- `checkBathroomComplianceNotes(scheduleItems)`
- `trackBathroomProductScheduleEvent(event)`

## Database And Migration Plan

Phase 1 does not add migrations. It uses local JSON storage. Future database tables should be created only after
approved local/staging Supabase credentials exist and migration verification passes.

Future tables:

- `bathroom_product_categories`
- `bathroom_products`
- `bathroom_product_rules`
- `bathroom_schedules`
- `bathroom_schedule_items`
- `bathroom_product_schedule_leads`

## Test Plan

Add unit/API tests for:

- Recommendation rules.
- Allowance calculation.
- Schedule generation.
- Local lead creation.
- Form/API validation.
- Quote-review flags.
- Compliance warning logic.

Run:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run verify:supabase:migrations`

## Acceptance Criteria

Phase 1 is accepted when:

1. A user can complete a bathroom product selector.
2. The app generates a schedule with vanity, basin, tapware, mirror/shaving cabinet and accessory recommendations.
3. The result includes allowance ranges.
4. The result includes WaterMark/WELS and installation warnings.
5. The user can request product quote, quote review or Operon consultation.
6. Lead context is saved or locally logged.
7. Quote review has a lightweight product allowance flag path.
8. Required docs exist under `/docs`.
9. Tests pass.
10. The app builds successfully.

## Phase 2 Product Intelligence Depth

Phase 2 remains deterministic and does not unlock checkout, supplier APIs, external AI, migrations,
procurement automation or Quote OS.

Approved Phase 2 additions:

- Product substitution suggestions for comparable categories.
- Product-pack comparison that explains fit, allowance alignment and watchouts.
- Pasted quote allowance parsing for product categories and PC item clarity.
- Builder-ready planning export for copy/print use.
- Tests confirming no internal supplier, margin, rate or private pricing fields are exposed publicly.

Phase 2 acceptance criteria:

1. Each generated schedule can include substitution options where safe category alternatives exist.
2. Recommended packs include fit and allowance-alignment guidance.
3. Pasted quote text produces category allowance checks without claiming a builder is wrong.
4. Builder export is planning-only and avoids checkout, purchase-order, final-pricing and compliance-certification claims.
5. Existing local checks pass.

## Non-Goals

- Checkout.
- Payment.
- Supplier API integration.
- Broad SKU catalogue.
- Freestanding bath selling.
- Custom shower glass ordering.
- Toilets as an MVP focus.
- External AI provider integration.
- Production Supabase or Netlify changes.
