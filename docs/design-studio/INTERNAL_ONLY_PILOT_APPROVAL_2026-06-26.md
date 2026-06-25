# Internal-Only Pilot Approval

Date: 2026-06-26

Status: approved for internal-only pilot use.

## Approved Pilot Path

Vincent approved the internal-only pilot path for `/design-studio`.

The approved configuration is:

- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true`
- `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=`
- `/design-studio` remains `noindex,nofollow`
- `/design-studio` remains hidden from public navigation, footer links and sitemap discovery

This approval is for internal review and manual feedback only. It is not approval for public discovery, external pilot exposure, public indexing, paid traffic, SEO exposure or broad release.

## Manual Feedback To Collect

For each internal reviewer, capture:

- Reviewer name or initials
- Date tested
- Device and viewport
- Browser
- Whether they reached the planning brief
- Any confusing step labels
- Any mobile spacing or keyboard/focus issue
- Whether the approximate layout preview made sense
- Whether the evidence-readiness checklist felt useful before a site measure
- Any wording that sounded like final pricing, measured plans, compliance certification or guaranteed buildability
- Whether they would know the next step after finishing

## Stop Conditions

Pause the pilot and open a fix branch if internal review finds:

- Missing noindex/nofollow metadata
- Any public discovery link while discovery is hidden
- Any sitemap inclusion while discovery is hidden
- Any claim of final quote, measured drawing, compliance certification or guaranteed buildability
- Any rate, margin, supplier cost, live SKU, procurement or Quote OS exposure
- Mobile controls that block completion
- Screen-reader or keyboard issues that prevent reaching the planning brief

## Still Locked

- External pilot exposure
- Public discovery
- Sitemap inclusion
- Navigation/footer exposure
- Public indexing
- User-entered measurements
- AR/browser-camera experiments
- Upload/storage
- Pricing, procurement, supplier/SKU claims and Quote OS
