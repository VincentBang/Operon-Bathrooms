# Private Upload Storage Decision Brief

Status: planning only. Do not implement storage until explicitly approved.

## Purpose

Quote review users may eventually need to upload quote PDFs, images, plans or photos. The current MVP is
placeholder-safe: the browser validates file type/size locally and stores metadata only. No public file
storage path is created, no public URL is returned and no uploaded file is exposed.

## Current Decision

Keep upload storage disabled until a private Supabase Storage design is approved.

## Allowed File Types

- PDF: `application/pdf`
- JPEG: `image/jpeg`
- PNG: `image/png`
- WebP: `image/webp`

Maximum size should remain `10MB` unless staging testing proves a smaller limit is more reliable.

## Private Bucket Requirement

If implemented, use a dedicated private bucket such as:

```text
bathroom-quote-review-files
```

The bucket must not be public. Do not create anonymous `SELECT` policies on `storage.objects`.

## Object Path Strategy

Use non-guessable paths scoped by lead and generated server-side:

```text
quote-reviews/{lead_id}/{upload_id}/{sanitized_filename}
request-reviews/{lead_id}/{upload_id}/{sanitized_filename}
site-measures/{lead_id}/{upload_id}/{sanitized_filename}
```

Do not trust customer filenames for access control. Store original filename as metadata only.

## Upload Path Options

Preferred MVP-safe option:

- Public form submits structured lead data first.
- Server returns no public upload URL.
- Admin/customer follow-up requests files manually until private storage is approved.

Future approved option:

- Server creates the lead first.
- Server generates a short-lived signed upload URL or handles upload through a server-side function.
- Client uploads only to the generated private path.
- Server stores file metadata in an admin-only table.

## Retrieval Rules

- Admin-only retrieval.
- Short-lived signed download URLs generated server-side only.
- Never expose raw storage paths or signed URLs in public API responses.
- Never list bucket contents from the browser.
- Do not include file URLs in customer-facing chatbot, estimate, quote-review or request-review responses.

## Data Model

If approved, use a table such as `bathroom_quote_review_files`:

- `id`
- `created_at`
- `lead_type`
- `lead_id`
- `bucket`
- `object_path`
- `original_filename`
- `mime_type`
- `file_size`
- `status`
- `uploaded_by`
- `virus_scan_status` nullable
- `internal_notes` nullable

RLS should be enabled. No anon `SELECT`, `UPDATE` or `DELETE`. Avoid anon `INSERT` unless the upload path
is explicitly approved and constrained.

## Security Controls

- Private bucket only.
- RLS enabled on file metadata table.
- No public bucket policy.
- No public file URLs in public responses.
- Service-role key remains server-side only.
- Signed URLs expire quickly.
- Reject unsupported MIME types and files over the approved limit.
- Sanitize filenames.
- Keep upload metadata out of public pages except safe filename/type/size acknowledgements if required.

## QA Before Enabling

- Static migration verifier catches `storage.objects` anon policies.
- Public API safety tests reject fake `publicUrl`, `signedUrl`, `storagePath` and `bucket` fields.
- Bundle safety scan confirms service-role key and storage internals are absent from client bundle.
- Supabase verification confirms no anon read access to file metadata.
- Browser network QA confirms no public response exposes object paths or signed URLs.

## Explicit Non-Goals

- No public uploads before approval.
- No permanent public URLs.
- No customer-facing file browser.
- No file sharing marketplace.
- No Quote OS document vault yet.
- No legal/compliance certification from uploaded documents.

## Recommendation

Do not implement storage in the current PR. Keep placeholder-safe upload handling and revisit private
storage only after merge readiness and staging email checks are complete.
