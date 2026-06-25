# Internal Pilot Operations Checklist

Use this checklist when running `/design-studio` for internal-only review without public discovery.

## Configuration

- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true`
- `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=`
- Do not set `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=public`.
- Do not add sitemap, nav or footer exposure.
- Keep `/design-studio` `noindex,nofollow`.

## Local Verification Commands

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY= npm run build
PORT=3026 NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY= npm start
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY= npm run qa:design-studio:a11y -- http://127.0.0.1:3026
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY= npm run qa:responsive -- http://127.0.0.1:3026
```

Smoke checks:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3026/design-studio
curl -sS http://127.0.0.1:3026/design-studio | rg -io 'noindex|nofollow'
curl -sS http://127.0.0.1:3026/sitemap.xml | rg -c 'design-studio' || true
curl -sS http://127.0.0.1:3026/ | rg -c 'Design studio|Bathroom Design Studio|/design-studio' || true
```

Expected results:

- `/design-studio` returns `200`.
- Robots output includes `noindex` and `nofollow`.
- Sitemap count is `0`.
- Homepage discovery count is `0`.

## Manual Review Points

- The route is planning-only.
- Before-contract-pricing copy is visible before the first input.
- The flow can reach the planning brief.
- Save/copy/print/estimate/review actions are reachable.
- Mobile has no horizontal overflow.
- Chatbot launcher does not block completion or critical controls.

## Stop Conditions

Pause and open a fix branch if any of these occur:

- `/design-studio` appears in the sitemap while discovery is hidden.
- `/design-studio` appears in public nav or footer while discovery is hidden.
- `noindex,nofollow` is missing.
- Any copy implies a final quote, measured plan, construction drawing, compliance certification or guaranteed buildability.
- Any private rate, margin, supplier cost, live SKU, procurement or Quote OS detail appears.
- Mobile layout prevents completion.
- Keyboard or assistive-technology proxy checks cannot reach the planning brief.

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
