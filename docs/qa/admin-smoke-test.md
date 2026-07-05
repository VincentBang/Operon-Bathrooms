# Admin Smoke Test

Purpose: verify that public lead submissions and protected admin reads are connected after a local
build or live deploy.

The script submits:

- one `/request-review` lead
- one `/product-schedule` lead

Then it verifies:

- `/api/admin/leads` returns the submitted standard lead and summary counts
- `/api/admin/product-schedules` returns the submitted Product Schedule and summary counts

## Local Run

Start a production server with a temporary local admin token:

```bash
OPERON_BATHROOMS_ADMIN_TOKEN="local-smoke-token" npm run start
```

In another terminal:

```bash
OPERON_BATHROOMS_ADMIN_TOKEN="local-smoke-token" npm run qa:admin:smoke -- http://localhost:3000
```

## Live Netlify Run

Only run against live after deploy verification is approved:

```bash
OPERON_BATHROOMS_ADMIN_TOKEN="your-token" \
OPERON_BATHROOMS_ADMIN_SMOKE_APPROVED=true \
npm run qa:admin:smoke -- https://operonbathrooms.netlify.app
```

## Safety Boundaries

- The script refuses non-local URLs unless `OPERON_BATHROOMS_ADMIN_SMOKE_APPROVED=true`.
- The admin token is required but never printed.
- Smoke records use `@example.com` addresses.
- The script checks for common secret/private-pricing markers in responses.
- This does not modify Supabase policies, Netlify settings, production env vars or private rate data.

## Passing Evidence

A passing run prints:

```text
Passed: submitted lead and Product Schedule are visible through protected admin endpoints.
```

