# Email Staging Verification

Status: preview/failure contract passed locally on 2026-06-20. Real send requires explicit approval and
provider env vars.

## Purpose

Verify Operon Bathrooms notification behaviour without making email mandatory for local builds or public lead
capture.

## Local Safe Contract

Run:

```bash
npm run qa:email:staging
```

This performs:

- Preview payload preparation.
- Customer acknowledgement copy check.
- Admin notification attribution/risk flag check.
- Provider failure simulation.
- Public result safety scan for provider keys, authorization headers, service-role keys, private rates and margins.

It does not send email unless explicit send approval is configured.

## Approved Staging Send

Only after staging email provider details are approved:

```bash
OPERON_BATHROOMS_EMAIL_QA_TARGET=staging \
OPERON_BATHROOMS_EMAIL_QA_SEND_APPROVED=true \
OPERON_BATHROOMS_NOTIFICATION_MODE=send \
OPERON_BATHROOMS_EMAIL_QA_RECIPIENT=<approved-test-recipient> \
RESEND_API_KEY=<staging-or-approved-provider-key> \
OPERON_BATHROOMS_ADMIN_EMAIL=<approved-admin-test-inbox> \
OPERON_BATHROOMS_FROM_EMAIL=<approved-from-address> \
npm run qa:email:staging
```

Do not run against production recipients unless Vincent explicitly approves a production smoke test.

## Expected Behaviour

- Preview mode prepares admin and customer payloads but sends nothing.
- Send mode is skipped unless `OPERON_BATHROOMS_EMAIL_QA_SEND_APPROVED=true`.
- Lead capture must not depend on email delivery succeeding.
- Provider failures must return generic errors only.
- Public responses must not expose provider keys, authorization headers, internal notes, private scoring, rates or margins.
- Customer acknowledgement must say planning guidance only and require site measure, selections, licensed trade checks and written scope confirmation before contract pricing.

## Known Limitation

Real email delivery has not been run in this repository session because provider env vars were not present.
