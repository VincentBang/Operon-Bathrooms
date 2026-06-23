# Design Studio Architecture

## Repository Audit

- Framework: Next.js 15 app router with React 19 and TypeScript.
- Validation: Zod in `lib/*schema.ts` files.
- UI: existing global CSS variables in `app/globals.css` with paper, teal, rust, panel and card patterns.
- Navigation: `app/layout.tsx` static link list.
- Sitemap: `app/sitemap.ts` static route array.
- Estimate handoff target: `/quote` and `components/QuoteWizard.tsx`.
- QA: `npm run lint`, `typecheck`, `test`, `build`, `verify:supabase:migrations`, `qa:bundle-safety`, `qa:local`, rendered crawl scripts.
- Existing local artifacts: `.local/*` QA/fallback files are ignored and must not be committed.

## Phase 0/1 Architecture

- Route: `/design-studio`, gated by `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true`.
- Data: `BathroomDesignDraft` schema version `0.1`.
- Storage: localStorage for structured drafts only; no images.
- Handoff: sessionStorage allowlisted design context into `/quote`.
- Events: typed local/no-op event function with no external analytics provider.
- Visuals: deterministic local CSS/SVG inspiration previews.
- Photo experiment: object URL in browser memory only.

## Exclusions

No server persistence, Supabase tables, production AI, cloud rendering, 3D, WebGL/WebGPU, AR, real supplier data or final pricing.
