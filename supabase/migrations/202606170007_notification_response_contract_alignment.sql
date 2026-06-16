-- Local SQL only. Do not apply to production without review.
-- Aligns notification/result and response status fields with the Phase 3a response workflow contract.

alter table public.bathroom_estimates
  add column if not exists notification_result jsonb,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false,
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz;

alter table public.bathroom_quote_reviews
  add column if not exists notification_result jsonb,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false,
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz;

alter table public.bathroom_review_requests
  add column if not exists notification_result jsonb,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false,
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz;

alter table public.bathroom_site_measure_requests
  add column if not exists notification_result jsonb,
  add column if not exists notification_prepared boolean not null default false,
  add column if not exists admin_notification_sent boolean not null default false,
  add column if not exists customer_acknowledgement_sent boolean not null default false,
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'bathroom_estimates',
    'bathroom_quote_reviews',
    'bathroom_review_requests',
    'bathroom_site_measure_requests'
  ]
  loop
    execute format('alter table public.%I drop constraint if exists %I', table_name, table_name || '_response_status_check');
    execute format(
      'alter table public.%I add constraint %I check (response_status in (
        ''not_started'',
        ''notification_prepared'',
        ''notification_sent'',
        ''acknowledgement_sent'',
        ''contacted'',
        ''awaiting_customer'',
        ''follow_up_needed'',
        ''booked'',
        ''site_measure_booked'',
        ''qualified'',
        ''not_fit'',
        ''closed''
      ))',
      table_name,
      table_name || '_response_status_check'
    );
  end loop;
end $$;

create table if not exists public.bathroom_lead_response_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_type text not null check (lead_type in ('estimate', 'quote_review', 'request_review', 'site_measure')),
  lead_id uuid not null,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  actor text,
  channel text,
  template_key text,
  note text
);

alter table public.bathroom_lead_response_events enable row level security;

-- No anon SELECT or anon UPDATE policies are defined here.
-- Admin reads and writes should remain server-side through service-role API routes only.
-- Uploaded quote files should remain in private storage buckets only.
