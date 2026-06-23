create table if not exists public.bathroom_estimates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_input jsonb not null,
  estimate_range jsonb not null,
  confidence_score integer not null check (confidence_score between 0 and 100),
  risk_flags text[] not null default '{}',
  contact_info jsonb not null
);

alter table public.bathroom_estimates enable row level security;

create policy "Allow anonymous bathroom estimate inserts"
  on public.bathroom_estimates
  for insert
  to anon
  with check (true);
