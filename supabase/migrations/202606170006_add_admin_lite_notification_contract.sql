alter table public.bathroom_estimates
  add column if not exists last_updated_at timestamptz,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false;

alter table public.bathroom_quote_reviews
  add column if not exists last_updated_at timestamptz,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false;

alter table public.bathroom_review_requests
  add column if not exists last_updated_at timestamptz,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false;

alter table public.bathroom_site_measure_requests
  add column if not exists last_updated_at timestamptz,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false;

create table if not exists public.bathroom_admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_type text not null check (lead_type in ('estimate', 'quote_review', 'request_review', 'site_measure')),
  lead_id uuid not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  actor text,
  note text
);

alter table public.bathroom_admin_activity_log enable row level security;

-- Local SQL only. Do not apply to production without review.
-- No anon SELECT or anon UPDATE policies are defined.
-- Admin reads and updates should run only through server-side service-role API routes.
