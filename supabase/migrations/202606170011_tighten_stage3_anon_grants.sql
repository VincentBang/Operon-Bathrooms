-- Keep public API exposure explicit.
-- Anon users may insert planning estimates only; no anon SELECT/UPDATE/DELETE.
-- Admin, dashboard, qualification, follow-up and manual review access stays service-role only.

revoke all privileges on table public.bathroom_admin_activity_log from anon;
revoke all privileges on table public.bathroom_estimates from anon;
revoke all privileges on table public.bathroom_lead_qualification_events from anon;
revoke all privileges on table public.bathroom_lead_response_events from anon;
revoke all privileges on table public.bathroom_manual_review_reports from anon;
revoke all privileges on table public.bathroom_quote_reviews from anon;
revoke all privileges on table public.bathroom_review_requests from anon;
revoke all privileges on table public.bathroom_site_measure_requests from anon;
revoke all privileges on table public.operon_chatbot_qualifications from anon;
revoke all privileges on table public.operon_follow_up_tasks from anon;

grant insert on table public.bathroom_estimates to anon;

grant all on table public.bathroom_admin_activity_log to service_role;
grant all on table public.bathroom_estimates to service_role;
grant all on table public.bathroom_lead_qualification_events to service_role;
grant all on table public.bathroom_lead_response_events to service_role;
grant all on table public.bathroom_manual_review_reports to service_role;
grant all on table public.bathroom_quote_reviews to service_role;
grant all on table public.bathroom_review_requests to service_role;
grant all on table public.bathroom_site_measure_requests to service_role;
grant all on table public.operon_chatbot_qualifications to service_role;
grant all on table public.operon_follow_up_tasks to service_role;
