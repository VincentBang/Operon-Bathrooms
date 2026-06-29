-- Private bathroom lead evidence file metadata and bucket contract.
--
-- This migration is source-controlled only until applied to an approved local or staging Supabase target.
-- Do not apply to production without a separate explicit production change request.
--
-- Design source:
-- docs/qa/private-upload-storage-policy-design-2026-06-29.md
-- Approval packet:
-- docs/qa/private-upload-storage-sql-approval-packet-2026-06-29.md

begin;

create table if not exists public.bathroom_lead_evidence_files (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_type text not null check (
    lead_type in ('quote_review', 'request_review', 'site_measure')
  ),
  lead_id uuid not null,
  bucket text not null default 'bathroom-lead-evidence-files',
  object_path text not null,
  original_filename text not null,
  sanitized_filename text not null,
  mime_type text not null check (
    mime_type in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')
  ),
  file_size integer not null check (file_size > 0 and file_size <= 10485760),
  status text not null default 'pending_upload' check (
    status in (
      'pending_upload',
      'uploaded',
      'scan_pending',
      'scan_passed',
      'scan_failed',
      'rejected',
      'deleted'
    )
  ),
  uploaded_by text not null default 'customer' check (
    uploaded_by in ('customer', 'admin', 'system')
  ),
  source_route text,
  upload_context jsonb not null default '{}'::jsonb,
  virus_scan_status text check (
    virus_scan_status is null
    or virus_scan_status in ('not_configured', 'pending', 'passed', 'failed')
  ),
  internal_notes text
);

comment on table public.bathroom_lead_evidence_files is
  'Private metadata for approved bathroom lead evidence files. No public read access.';

comment on column public.bathroom_lead_evidence_files.object_path is
  'Private storage object path generated server-side. Never return from public APIs.';

comment on column public.bathroom_lead_evidence_files.internal_notes is
  'Admin-only notes. Never return from public APIs.';

create unique index if not exists bathroom_lead_evidence_files_object_path_idx
  on public.bathroom_lead_evidence_files (bucket, object_path);

create index if not exists bathroom_lead_evidence_files_lead_idx
  on public.bathroom_lead_evidence_files (lead_type, lead_id, created_at desc);

create index if not exists bathroom_lead_evidence_files_status_idx
  on public.bathroom_lead_evidence_files (status, created_at desc);

alter table public.bathroom_lead_evidence_files enable row level security;

revoke all privileges on table public.bathroom_lead_evidence_files from anon;
revoke all privileges on table public.bathroom_lead_evidence_files from authenticated;
grant all on table public.bathroom_lead_evidence_files to service_role;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'bathroom-lead-evidence-files',
  'bathroom-lead-evidence-files',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No object access policies are created in this migration.
-- Upload and download behavior remains locked behind server-side implementation approval.

commit;

