/* global console, process */

import { createClient } from "@supabase/supabase-js";

const approved = process.env.OPERON_BATHROOMS_SUPABASE_QA_APPROVED === "true";
const target = process.env.OPERON_BATHROOMS_SUPABASE_QA_TARGET || "";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const checkedTables = [
  "bathroom_estimates",
  "bathroom_quote_reviews",
  "bathroom_review_requests",
  "bathroom_site_measure_requests",
  "bathroom_lead_response_events",
  "bathroom_lead_qualification_events",
  "bathroom_lead_evidence_files",
  "bathroom_admin_activity_log",
  "bathroom_manual_review_reports",
  "operon_chatbot_qualifications",
  "operon_follow_up_tasks"
];

const disallowedAnonInsertTables = [
  "bathroom_quote_reviews",
  "bathroom_review_requests",
  "bathroom_site_measure_requests",
  "bathroom_lead_evidence_files",
  "operon_chatbot_qualifications",
  "operon_follow_up_tasks"
];

const failures = [];
const warnings = [];
const cleanup = [];
const marker = `qa_${Date.now()}_${Math.random().toString(36).slice(2)}`;

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function requireEnv() {
  if (!approved) {
    fail("Set OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true before running against an approved local/staging project.");
  }
  if (!["local", "staging"].includes(target)) {
    fail("Set OPERON_BATHROOMS_SUPABASE_QA_TARGET to local or staging. This script refuses production targets.");
  }
  if (!url || !anonKey || !serviceKey) {
    fail("NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are required.");
  }
  if (/prod|production/i.test(target) || /prod|production/i.test(url)) {
    fail("The Supabase QA target appears to be production. Refusing to run.");
  }
  if (serviceKey.startsWith("sb_publishable_") || serviceKey === anonKey) {
    fail("SUPABASE_SERVICE_ROLE_KEY does not look like a separate server-side service credential.");
  }
}

function safeError(error) {
  if (!error) return "";
  return [error.code, error.message].filter(Boolean).join(" ");
}

function client(key) {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function estimatePayload() {
  return {
    user_input: {
      qa_marker: marker,
      projectType: "main-bathroom",
      propertyType: "house",
      suburb: "Sydney"
    },
    estimate_range: {
      label: "Planning range only",
      qa_marker: marker
    },
    confidence_score: 55,
    risk_flags: ["QA verification row"],
    contact_info: {
      name: "Supabase QA",
      email: `supabase-${marker}@example.com`,
      suburb: "Sydney"
    },
    source_route: "/quote",
    landing_page: "/quote",
    utm_source: "supabase-qa",
    utm_campaign: marker,
    privacy_accepted: true,
    terms_accepted: true,
    guidance_accepted: true
  };
}

function disallowedInsertPayload(table) {
  if (table === "bathroom_lead_evidence_files") {
    return {
      lead_type: "quote_review",
      lead_id: "00000000-0000-4000-8000-000000000001",
      bucket: "bathroom-lead-evidence-files",
      object_path: `quote_review/00000000-0000-4000-8000-000000000001/${marker}/quote.pdf`,
      original_filename: "quote.pdf",
      sanitized_filename: "quote.pdf",
      mime_type: "application/pdf",
      file_size: 1024,
      status: "pending_upload",
      uploaded_by: "customer",
      source_route: "/quote/review",
      upload_context: { qa_marker: marker }
    };
  }
  if (table === "operon_chatbot_qualifications") {
    return {
      status: "new",
      source_route: "/chatbot",
      contact_info: { email: `chatbot-${marker}@example.com` },
      chatbot_payload: { qa_marker: marker },
      qualification_result: { qa_marker: marker },
      risk_flags: ["QA verification row"],
      missing_evidence: ["QA evidence"],
      recommended_next_action: "request_evidence",
      confidence_score: 50,
      privacy_accepted: true,
      terms_accepted: true,
      guidance_accepted: true
    };
  }
  if (table === "operon_follow_up_tasks") {
    return {
      status: "open",
      priority: "normal",
      task_type: "admin_check",
      lead_type: "chatbot",
      title: `Supabase QA ${marker}`,
      description: "This insert should not be possible with anon credentials.",
      source_route: "/chatbot",
      risk_flags: ["QA verification row"],
      task_payload: { qa_marker: marker }
    };
  }
  return {
    status: "new",
    source_route: table === "bathroom_quote_reviews" ? "/quote/review" : table === "bathroom_review_requests" ? "/request-review" : "/site-measure",
    landing_page: "/supabase-qa",
    utm_source: "supabase-qa",
    utm_campaign: marker,
    form_payload: {
      qa_marker: marker,
      name: "Supabase QA",
      email: `${table}-${marker}@example.com`
    },
    risk_flags: ["QA verification row"],
    scoring_result: { qa_marker: marker },
    privacy_accepted: true,
    terms_accepted: true,
    guidance_accepted: true
  };
}

async function expectAnonSelectBlocked(anon, table) {
  const { data, error } = await anon.from(table).select("id").limit(1);
  if (error) {
    console.log(`- anon SELECT ${table}: blocked (${safeError(error)})`);
    return;
  }
  if (Array.isArray(data) && data.length === 0) {
    console.log(`- anon SELECT ${table}: returned no rows`);
    return;
  }
  fail(`anon SELECT exposed rows from ${table}.`);
}

async function expectAnonInsertBlocked(anon, service, table) {
  const payload = disallowedInsertPayload(table);
  const { data, error } = await anon.from(table).insert(payload).select("id").maybeSingle();
  if (error) {
    console.log(`- anon INSERT ${table}: blocked (${safeError(error)})`);
    return;
  }
  const insertedId = data?.id;
  if (insertedId) {
    cleanup.push({ table, id: insertedId });
  } else {
    warn(`anon INSERT ${table} returned no error but no id. Attempting marker cleanup.`);
    await cleanupByMarker(service, table);
  }
  fail(`anon INSERT unexpectedly succeeded on ${table}.`);
}

async function cleanupByMarker(service, table) {
  if (table === "operon_chatbot_qualifications") {
    await service.from(table).delete().contains("chatbot_payload", { qa_marker: marker });
    return;
  }
  if (table === "operon_follow_up_tasks") {
    await service.from(table).delete().contains("task_payload", { qa_marker: marker });
    return;
  }
  if (table === "bathroom_estimates") {
    await service.from(table).delete().contains("estimate_range", { qa_marker: marker });
    return;
  }
  if (table === "bathroom_lead_evidence_files") {
    await service.from(table).delete().contains("upload_context", { qa_marker: marker });
    return;
  }
  await service.from(table).delete().eq("utm_campaign", marker);
}

async function verifyAnonEstimateInsert(anon) {
  const { data, error } = await anon.from("bathroom_estimates").insert(estimatePayload()).select("id").maybeSingle();
  if (error || !data?.id) {
    fail(`anon INSERT bathroom_estimates failed: ${safeError(error)}`);
    return null;
  }
  cleanup.push({ table: "bathroom_estimates", id: data.id });
  console.log("- anon INSERT bathroom_estimates: succeeded");
  return data.id;
}

async function verifyAnonEstimateCannotMutate(anon, estimateId) {
  if (!estimateId) return;
  const { error: updateError } = await anon.from("bathroom_estimates").update({ confidence_score: 99 }).eq("id", estimateId);
  if (!updateError) fail("anon UPDATE unexpectedly succeeded on bathroom_estimates.");
  else console.log(`- anon UPDATE bathroom_estimates: blocked (${safeError(updateError)})`);

  const { error: deleteError } = await anon.from("bathroom_estimates").delete().eq("id", estimateId);
  if (!deleteError) fail("anon DELETE unexpectedly succeeded on bathroom_estimates.");
  else console.log(`- anon DELETE bathroom_estimates: blocked (${safeError(deleteError)})`);
}

async function verifyServiceRolePrivateAccess(service) {
  const evidencePayload = {
    lead_type: "quote_review",
    lead_id: "00000000-0000-4000-8000-000000000002",
    bucket: "bathroom-lead-evidence-files",
    object_path: `quote_review/00000000-0000-4000-8000-000000000002/${marker}/quote.pdf`,
    original_filename: "builder quote.pdf",
    sanitized_filename: "builder-quote.pdf",
    mime_type: "application/pdf",
    file_size: 2048,
    status: "pending_upload",
    uploaded_by: "customer",
    source_route: "/quote/review",
    upload_context: { qa_marker: marker, purpose: "staging-contract" },
    virus_scan_status: "not_configured",
    internal_notes: "QA row. Delete after verification."
  };
  const { data: evidenceFile, error: evidenceError } = await service
    .from("bathroom_lead_evidence_files")
    .insert(evidencePayload)
    .select("id, bucket, object_path, internal_notes")
    .maybeSingle();
  if (evidenceError || !evidenceFile?.id) {
    fail(`service-role INSERT bathroom_lead_evidence_files failed: ${safeError(evidenceError)}`);
    return;
  }
  cleanup.push({ table: "bathroom_lead_evidence_files", id: evidenceFile.id });
  if (
    evidenceFile.bucket !== "bathroom-lead-evidence-files" ||
    !evidenceFile.object_path.includes(marker) ||
    !evidenceFile.internal_notes
  ) {
    fail("service-role evidence file metadata read returned unexpected values.");
  }
  console.log("- service-role private evidence file metadata insert-read: succeeded");

  const qualificationPayload = {
    status: "manual_review_needed",
    source_route: "/chatbot",
    landing_page: "/supabase-qa",
    utm_source: "supabase-qa",
    utm_campaign: marker,
    session_id: marker,
    lead_type: "chatbot",
    contact_info: { name: "Supabase QA", email: `chatbot-${marker}@example.com`, suburb: "Sydney" },
    chatbot_payload: { qa_marker: marker, message: "Apartment bathroom waterproofing risk." },
    qualification_result: { qa_marker: marker, recommendedNextAction: "request_evidence" },
    risk_flags: ["apartment / strata", "waterproofing uncertainty"],
    missing_evidence: ["photos", "quote"],
    recommended_next_action: "request_evidence",
    confidence_score: 48,
    manual_review_required: true,
    privacy_accepted: true,
    terms_accepted: true,
    guidance_accepted: true
  };
  const { data: qualification, error: qualificationError } = await service
    .from("operon_chatbot_qualifications")
    .insert(qualificationPayload)
    .select("id, manual_review_required")
    .maybeSingle();
  if (qualificationError || !qualification?.id) {
    fail(`service-role INSERT operon_chatbot_qualifications failed: ${safeError(qualificationError)}`);
    return;
  }
  cleanup.push({ table: "operon_chatbot_qualifications", id: qualification.id });
  if (qualification.manual_review_required !== true) {
    fail("service-role chatbot qualification read returned unexpected manual_review_required value.");
  }

  const taskPayload = {
    status: "open",
    priority: "high",
    task_type: "manual_review",
    lead_type: "chatbot",
    chatbot_qualification_id: qualification.id,
    title: `Supabase QA ${marker}`,
    description: "Verify service-role private follow-up task access.",
    due_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    source_route: "/chatbot",
    utm_source: "supabase-qa",
    utm_campaign: marker,
    risk_flags: ["waterproofing uncertainty"],
    task_payload: { qa_marker: marker }
  };
  const { data: task, error: taskError } = await service
    .from("operon_follow_up_tasks")
    .insert(taskPayload)
    .select("id, chatbot_qualification_id, priority")
    .maybeSingle();
  if (taskError || !task?.id) {
    fail(`service-role INSERT operon_follow_up_tasks failed: ${safeError(taskError)}`);
    return;
  }
  cleanup.push({ table: "operon_follow_up_tasks", id: task.id });
  if (task.chatbot_qualification_id !== qualification.id || task.priority !== "high") {
    fail("service-role follow-up task read returned unexpected relation or priority.");
  }
  console.log("- service-role private chatbot/follow-up insert-read: succeeded");
}

async function cleanupRows(service) {
  for (const item of cleanup.reverse()) {
    const { error } = await service.from(item.table).delete().eq("id", item.id);
    if (error) warn(`Cleanup failed for ${item.table}/${item.id}: ${safeError(error)}`);
  }
  for (const table of checkedTables) {
    await cleanupByMarker(service, table);
  }
}

async function main() {
  requireEnv();
  if (failures.length) return;

  const anon = client(anonKey);
  const service = client(serviceKey);

  console.log("Supabase local/staging contract QA");
  console.log(`- Target: ${target}`);
  console.log("- Keys are loaded but never printed.");

  try {
    const estimateId = await verifyAnonEstimateInsert(anon);
    await verifyAnonEstimateCannotMutate(anon, estimateId);
    for (const table of checkedTables) {
      await expectAnonSelectBlocked(anon, table);
    }
    for (const table of disallowedAnonInsertTables) {
      await expectAnonInsertBlocked(anon, service, table);
    }
    await verifyServiceRolePrivateAccess(service);
  } finally {
    await cleanupRows(service);
  }
}

await main();

if (warnings.length) {
  console.log("\nWarnings:");
  for (const message of warnings) console.log(`- ${message}`);
}

if (failures.length) {
  console.error("\nFailures:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("\nPassed: approved local/staging Supabase contract blocks anon reads/mutations and keeps private admin data service-role only.");
