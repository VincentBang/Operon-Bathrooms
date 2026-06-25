# Design Studio Next Actions

1. Run the internal-only `/design-studio` pilot using `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true` and `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=`.
2. Collect feedback with `docs/design-studio/INTERNAL_ONLY_PILOT_FEEDBACK_TEMPLATE.md`.
3. Pause and open a fix branch if noindex, discovery-hidden, planning-only wording, mobile usability, keyboard access or screen-reader boundaries regress.
4. Do not set discovery to `public` without a separate approval.
5. Do not add camera, upload, storage, LiDAR, BIM, production AR, measured-plan, pricing, procurement, Quote OS, payment, CRM or marketplace work without a specific gate approval.
6. Keep user-entered approximate measurements, AR/browser-camera experiments, public indexing, external exposure and broad release changes locked until separate approval.
