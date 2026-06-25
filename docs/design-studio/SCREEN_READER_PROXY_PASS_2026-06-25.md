# Design Studio Screen-Reader Proxy Pass

Date: 2026-06-25

Branch: `codex/design-studio-screen-reader-proxy-pass`

Base: updated `main` after PR #16 discovery split merge (`fb49056`)

## Purpose

Record the executable screen-reader proxy and controlled noindex pilot checks after the discovery split. This is an audit artifact only. It does not mark the external pilot human VoiceOver gate as complete.

## Local Configuration

- Local server: `http://127.0.0.1:3024`
- Route flag: `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true`
- Discovery flag: `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=`
- Expected route behavior: `/design-studio` renders locally.
- Expected discovery behavior: `/design-studio` remains hidden from homepage/nav/footer discovery and sitemap.
- Expected metadata: `/design-studio` remains `noindex,nofollow`.

## Evidence

### Assistive-Technology Proxy

Command:

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run qa:design-studio:a11y -- http://127.0.0.1:3024
```

Result: passed.

Key output:

- `desktop: controls=37 axButtons=6 axComboboxes=0 resultActions=5`
- `mobile: controls=37 axButtons=6 axComboboxes=0 resultActions=5`
- `Passed: Design Studio keyboard and assistive-technology proxy QA completed.`

Covered checks:

- One clear H1.
- Route metadata remains noindex/nofollow.
- Active step semantics are present.
- Visible controls have names.
- Layout fieldset legends are present.
- Approximate layout preview has an accessible label.
- Result actions are reachable through the scripted keyboard path.

### Controlled Noindex Smoke

Commands checked:

- `/design-studio` returns `200`.
- `/design-studio` source includes `noindex,nofollow`.
- `/sitemap.xml` does not include `design-studio` while discovery is hidden.
- Homepage does not expose a Design Studio discovery link while discovery is hidden.

Result: passed.

### Responsive QA

Command:

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run qa:responsive -- http://127.0.0.1:3024
```

Result: passed across 7 routes at 4 viewport sizes.

Design Studio evidence:

- `desktop /design-studio h1=1 overflow=0 chatbot=yes focusable=37`
- `laptop /design-studio h1=1 overflow=0 chatbot=yes focusable=37`
- `tablet /design-studio h1=1 overflow=0 chatbot=yes focusable=37`
- `mobile /design-studio h1=1 overflow=0 chatbot=yes focusable=37`

## What This Does Not Prove

- This is not a human VoiceOver pass.
- It does not prove human auditory comprehension, rotor order, screen-reader preference compatibility or real user understanding.
- It does not approve external pilot exposure.
- It does not approve public discovery, sitemap inclusion or navigation/footer links.

## Boundaries Confirmed

- `/design-studio` remains feature-flagged.
- `/design-studio` remains noindex/nofollow.
- Public discovery remains hidden unless `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=public` is separately approved.
- User-entered measurements remain locked.
- AR/browser-camera experiments remain locked.
- Upload/storage remains locked.
- Pricing, procurement, supplier/SKU claims and Quote OS remain locked.
- Public copy remains planning-only.

## Next Gate

Review and merge this audit branch if the evidence scope is acceptable. Before external pilot exposure, complete a true human VoiceOver or equivalent screen-reader pass, unless Vincent explicitly accepts this proxy evidence for an internal-only pilot while keeping discovery hidden and noindex.
