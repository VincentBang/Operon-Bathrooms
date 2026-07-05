# Operon Bathroom Product Schedule Data Model Plan

## Phase 1 Storage Choice

The app does not currently have a product database or ORM. Phase 1 therefore uses local TypeScript seed data and a
local JSON store for generated schedules and leads. This keeps the MVP deterministic, reviewable and independent of
production Supabase settings.

## ProductCategory

- `id`
- `name`
- `slug`
- `type`
- `room`
- `risk_level`
- `strategic_fit_score`
- `default_margin_range`
- `freight_risk`
- `warranty_risk`
- `compliance_risk`

Public UI must not expose margin range values. They exist only to remind future implementation where internal strategy
may live.

## Product

- `id`
- `name`
- `slug`
- `category_id`
- `brand`
- `supplier`
- `product_type`
- `finish`
- `material`
- `dimensions`
- `width`
- `depth`
- `height`
- `wall_hung`
- `floorstanding`
- `soft_close`
- `basin_type`
- `tap_hole_count`
- `price_min`
- `price_max`
- `estimated_margin`
- `watermark_required`
- `watermark_status`
- `wels_required`
- `wels_rating`
- `electrical_compliance_required`
- `compliance_notes`
- `installation_notes`
- `freight_risk`
- `warranty_risk`
- `active`
- `recommended`

Public schedule output may show allowance ranges and compliance notes, but not estimated margin, supplier cost or
private procurement notes.

## ProductRule

- `id`
- `rule_type`
- `input_condition`
- `recommended_category`
- `warning`
- `priority`

Phase 1 rules are deterministic TypeScript functions. Future data-backed rules can use the same shape.

## BathroomSchedule

- `id`
- `user_id nullable`
- `lead_id nullable`
- `project_type`
- `bathroom_type`
- `bathroom_size`
- `style`
- `budget_level`
- `vanity_width`
- `basin_preference`
- `tapware_finish`
- `mirror_preference`
- `shower_configuration`
- `postcode`
- `timeline`
- `generated_summary`
- `total_allowance_low`
- `total_allowance_high`
- `created_at`

## BathroomScheduleItem

- `id`
- `schedule_id`
- `category`
- `recommended_product_id nullable`
- `allowance_low`
- `allowance_high`
- `reason`
- `compliance_note`
- `risk_note`

## Lead

- `id`
- `name`
- `email`
- `phone`
- `postcode`
- `project_type`
- `timeline`
- `source`
- `schedule_id nullable`
- `quote_review_requested`
- `created_at`

Lead `source` for this workflow must be `bathroom_product_schedule`.

## Future Supabase Migration Notes

When approved local/staging Supabase access exists:

1. Create tables with RLS enabled.
2. Do not allow anon `SELECT` on leads or schedules.
3. Use server-side inserts for schedule leads.
4. Keep margin, supplier and internal procurement fields out of public responses.
5. Add admin-only reads through existing admin auth.
6. Verify with `npm run verify:supabase:migrations` and a dedicated staging contract verifier before production.

## Seed Data Policy

Phase 1 seed data represents categories and recommendation candidates only. It is not stock, live price, supplier
commitment, procurement advice or checkout data.
