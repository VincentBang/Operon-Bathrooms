# Private Upload Storage Upload Route Contracts - 2026-07-02

Status: UPLOAD_ROUTE_IMPLEMENTATION_LOCKED_CONTRACT_READY

This note defines future upload initiation and completion route contracts for private lead evidence files. It does not
create upload routes, admin retrieval routes, Supabase Storage buckets, storage policies, production Supabase changes,
production Netlify changes, deployment or Quote OS behavior.

## Current Boundary

Storage remains disabled in public lead flows.

Current public behavior:

- Quote-review upload control validates type and size locally.
- Public copy says file storage is not enabled.
- Public request-review and site-measure flows do not store files.
- Public API responses do not echo `bucket`, `object_path`, `storage_path`, `publicUrl`, `signedUrl` or Supabase
  storage host URLs.

## Future Route Names

If separately approved, use these route names:

- `POST /api/prepare-lead-evidence-upload`
- `POST /api/complete-lead-evidence-upload`

Do not add alternate public upload route names without updating tests and docs.

## Upload Initiation Contract

`POST /api/prepare-lead-evidence-upload` may be implemented only after the approved local/staging Supabase apply gate
passes.

Required request fields:

- `leadType`: one of `quote_review`, `request_review`, `site_measure`.
- `leadId`: existing lead id.
- `fileName`: original customer filename.
- `fileType`: MIME type.
- `fileSize`: byte size.
- `sourceRoute`: public route where the evidence is submitted.
- Consent confirmation if a fresh public request is used.
- Honeypot field if called from a public form.

Required validation:

1. Reject unsupported lead types.
2. Reject unknown or missing lead ids.
3. Reject file types outside PDF, JPEG, PNG and WebP.
4. Reject files over 10MB.
5. Sanitize filenames server-side.
6. Generate upload id and object path server-side.
7. Do not trust a client-supplied bucket, object path, storage path or URL.
8. Create metadata only after lead ownership/context checks pass.
9. Return safe customer-facing errors without storage internals.

Public response may include:

- `ok`
- `uploadId`
- `allowedFileTypes`
- `maxFileSize`
- `expiresAt`
- A short-lived upload mechanism only if separately approved.

Public response must not include:

- Service-role keys.
- Permanent public URLs.
- Raw bucket names.
- Raw object paths.
- Long-lived signed URLs.
- Internal notes.
- Manual review report data.
- Lead qualification internals.

## Upload Completion Contract

`POST /api/complete-lead-evidence-upload` may be implemented only after initiation is approved and tested.

Required request fields:

- `leadType`
- `leadId`
- `uploadId`
- Completion status.
- Safe file metadata confirmation.

Required validation:

1. Confirm the upload metadata row exists.
2. Confirm the row belongs to the requested lead.
3. Confirm the row is not already rejected or deleted.
4. Confirm expected MIME type and size match the initiation record.
5. Mark status without returning private object paths.
6. Prepare notification/update context without exposing storage internals publicly.

Public response may include:

- `ok`
- `uploadStatus`
- Safe filename/type/size acknowledgement.
- Next-step copy that remains planning guidance only.

Public response must not include:

- `bucket`
- `object_path`
- `storage_path`
- `publicUrl`
- `signedUrl`
- Supabase storage host URLs.
- Internal notes.
- Manual review report content.
- Lead scoring or qualification internals.

## Tests Added

`tests/public-api-safety.test.ts` now asserts:

- Public upload route folders remain absent while storage is locked.
- `components/QuoteReviewForm.tsx` keeps the public disabled-storage message.
- The quote-review form does not reference future upload routes or signed/public URL markers.

## Resume Criteria

Upload route implementation remains locked until:

1. Approved local/staging Supabase inputs are available.
2. The private evidence table and bucket row migration is applied only to an approved non-production target.
3. `npm run qa:supabase:staging` passes.
4. Upload initiation route implementation is separately approved.
5. Upload completion route implementation is separately approved.
6. Admin retrieval remains separately gated.

## Confirmation

- No upload initiation route was added.
- No upload completion route was added.
- No admin retrieval route was added.
- No SQL was applied.
- No Supabase Storage bucket was created.
- No storage policy was created.
- No production Supabase setting was changed.
- No production Netlify setting was changed.
- No deployment was performed.
- Quote OS remains locked.
