# VoiceOver Screen-Reader Checklist

Date prepared: 2026-06-24

Purpose: guide the final human VoiceOver or equivalent screen-reader pass before any public release exposure of the Phase 2 Design Studio flow.

## Setup

- Run locally only.
- Enable `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true`.
- Open `/design-studio`.
- Keep `/design-studio` feature-flagged and noindex.

## Required Checks

1. Confirm the page announces one clear H1: `Operon Bathroom Design Studio`.
2. Confirm the route is described as a planning preview, not a final quote, measured plan, specification or construction document.
3. Tab through the first step and confirm bathroom type controls are reachable and understandable.
4. Activate `Next` and confirm step progress is understandable.
5. Reach the approximate layout step.
6. Confirm fieldset legends are announced:
   - Approximate room shape
   - Approximate size band
   - Approximate door entry
   - Fixture-zone placement
7. Confirm the approximate layout preview has an understandable accessible name.
8. Confirm fixture-zone selects announce their fixture label and purpose.
9. Continue to the result brief.
10. Confirm result actions are reachable:
    - Save locally
    - Copy design summary
    - Print brief
    - Start planning estimate
    - Request scope review
11. Confirm no copy sounds like final pricing, legal advice, compliance certification or measured construction documentation.
12. Confirm chatbot launcher does not block critical controls on mobile.

## Pass Standard

- A screen-reader user can understand where they are in the flow.
- Form controls and action buttons have usable names.
- The approximate layout is announced as a planning preview, not a measured plan.
- The result brief can be reached without a mouse.
- Public copy remains planning guidance only.

## Current Status

Automated browser and accessibility proxy checks passed again on 2026-06-25 after the discovery split, using the controlled noindex pilot configuration with the route enabled and public discovery hidden. See `docs/design-studio/SCREEN_READER_PROXY_PASS_2026-06-25.md`.

This automated proxy pass does not replace a human VoiceOver or equivalent screen-reader pass before external pilot exposure.
