# Internal-Only Pilot Pass 1

Date: 2026-06-26

Status: gate-review-ready.

## Summary

The first internal-only `/design-studio` pilot pass has been completed locally using the approved route-enabled, discovery-hidden configuration.

This pass validates that the feature can be opened internally, remains hidden from public discovery, remains noindex/nofollow, can be completed through the scripted keyboard path and has responsive screenshots across desktop, laptop, tablet and mobile viewports.

## Result

- Route enabled locally: passed.
- Public discovery hidden: passed.
- Sitemap exclusion while discovery hidden: passed.
- Noindex/nofollow metadata: passed.
- Design Studio a11y proxy: passed.
- Responsive QA: passed.
- First reviewer notes captured: passed.

## Watch Item

The mobile chatbot launcher can visually sit over lower-right non-control content while scrolling. It did not block completion, result actions or submit controls in this pass, so it is recorded as a monitor item rather than a stop condition.

## Still Not Approved

- External pilot exposure
- Public discovery
- Sitemap inclusion
- Navigation/footer exposure
- Public indexing
- User-entered measurements
- AR/browser-camera experiments
- Upload/storage
- Pricing, procurement, supplier/SKU claims and Quote OS

## Next Step

Review this pass and continue internal-only pilot testing with a human reviewer using `docs/design-studio/INTERNAL_ONLY_PILOT_FEEDBACK_TEMPLATE.md`.
