alter table public.bathroom_estimates
  add column if not exists updated_at timestamptz,
  add column if not exists form_payload jsonb,
  add column if not exists guidance_accepted boolean not null default false,
  add column if not exists privacy_accepted boolean not null default false,
  add column if not exists terms_accepted boolean not null default false,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz,
  add column if not exists notification_result jsonb,
  add column if not exists response_template_key text;

alter table public.bathroom_quote_reviews
  add column if not exists updated_at timestamptz,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz,
  add column if not exists notification_result jsonb,
  add column if not exists response_template_key text;

alter table public.bathroom_review_requests
  add column if not exists updated_at timestamptz,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz,
  add column if not exists notification_result jsonb,
  add column if not exists response_template_key text;

alter table public.bathroom_site_measure_requests
  add column if not exists updated_at timestamptz,
  add column if not exists response_status text not null default 'not_started',
  add column if not exists response_priority text not null default 'normal',
  add column if not exists notification_sent_at timestamptz,
  add column if not exists acknowledgement_sent_at timestamptz,
  add column if not exists first_response_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists response_due_at timestamptz,
  add column if not exists follow_up_at timestamptz,
  add column if not exists notification_result jsonb,
  add column if not exists response_template_key text;

do $$
begin
  alter table public.bathroom_estimates
    add constraint bathroom_estimates_response_status_check
    check (response_status in (
      'not_started',
      'notification_sent',
      'acknowledgement_sent',
      'contacted',
      'awaiting_customer',
      'follow_up_needed',
      'site_measure_booked',
      'qualified',
      'not_fit',
      'closed'
    ));
exception when duplicate_object then null;
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
  template_key text
);

alter table public.bathroom_lead_response_events enable row level security;

-- No anon SELECT or UPDATE policies are defined for lead tables or response events.
-- Service-role server functions should perform admin and notification updates.
-- Public insert policies should remain limited to reviewed lead-capture paths only.
