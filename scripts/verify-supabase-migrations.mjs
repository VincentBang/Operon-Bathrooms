/* global console, process, URL */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const migrationDir = fileURLToPath(
  new URL("../supabase/migrations/", import.meta.url)
);
const files = readdirSync(migrationDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const sqlByFile = new Map(
  files.map((file) => [file, readFileSync(join(migrationDir, file), "utf8")])
);

const allSql = [...sqlByFile.values()].join("\n\n").toLowerCase();
const statements = allSql
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

const createdTables = [];
for (const [file, sql] of sqlByFile.entries()) {
  const matches = sql.matchAll(
    /create\s+table\s+(?:if\s+not\s+exists\s+)?public\.((?:bathroom|operon)_[a-z0-9_]+)/gi
  );
  for (const match of matches) {
    createdTables.push({ file, table: match[1].toLowerCase() });
  }
}

const requiredTables = new Set(createdTables.map(({ table }) => table));
const failures = [];
const warnings = [];

if (requiredTables.size === 0) {
  failures.push("No public.bathroom_* tables were found in migrations.");
}

for (const table of requiredTables) {
  const rlsPattern = new RegExp(
    `alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security`,
    "i"
  );
  if (!rlsPattern.test(allSql)) {
    failures.push(`Missing ENABLE ROW LEVEL SECURITY for public.${table}.`);
  }
}

const forbiddenAnonPolicyPattern =
  /create\s+policy[\s\S]*?on\s+public\.((?:bathroom|operon)_[a-z0-9_]+)[\s\S]*?for\s+(select|update|delete|all)[\s\S]*?to\s+anon/gi;

for (const statement of statements) {
  for (const match of statement.matchAll(forbiddenAnonPolicyPattern)) {
    failures.push(
      `Forbidden anon ${match[2].toUpperCase()} policy found on public.${match[1]}.`
    );
  }
}

const anonInsertPattern =
  /create\s+policy[\s\S]*?on\s+public\.((?:bathroom|operon)_[a-z0-9_]+)[\s\S]*?for\s+insert[\s\S]*?to\s+anon/gi;

const anonInsertTables = new Set();
for (const statement of statements) {
  for (const match of statement.matchAll(anonInsertPattern)) {
    anonInsertTables.add(match[1]);
  }
}

const allowedAnonInsertTables = new Set(["bathroom_estimates"]);
for (const table of anonInsertTables) {
  if (!allowedAnonInsertTables.has(table)) {
    failures.push(
      `Unexpected anon INSERT policy found on public.${table}. Use server-side inserts unless explicitly approved.`
    );
  }
}

const privateTables = [
  "bathroom_manual_review_reports",
  "bathroom_admin_notifications",
  "bathroom_lead_qualification_events",
  "operon_chatbot_qualifications",
  "operon_follow_up_tasks"
];

for (const table of privateTables) {
  if (!requiredTables.has(table)) {
    continue;
  }

  const anonPolicyPattern = new RegExp(
    `create\\s+policy[\\s\\S]*?on\\s+public\\.${table}[\\s\\S]*?to\\s+anon`,
    "i"
  );
  if (statements.some((statement) => anonPolicyPattern.test(statement))) {
    failures.push(`Private table public.${table} has an anon policy.`);
  }
}

const unexpectedAnonGrantPattern =
  /grant\s+(select|update|delete|all|insert\s*,|insert\s+.+select)[\s\S]*?on\s+table\s+public\.((?:bathroom|operon)_[a-z0-9_]+)[\s\S]*?to\s+anon/i;

const riskyPatterns = [
  { label: "SECURITY DEFINER", pattern: /security\s+definer/i },
  {
    label: "public storage policy",
    pattern: /storage\.objects[\s\S]*?to\s+anon/i
  },
  {
    label: "public bathroom view",
    pattern: /create\s+(?:or\s+replace\s+)?view\s+public\.(?:bathroom|operon)_/i
  },
  {
    label: "explicit anon grant",
    pattern: unexpectedAnonGrantPattern
  }
];

for (const { label, pattern } of riskyPatterns) {
  if (statements.some((statement) => pattern.test(statement))) {
    warnings.push(
      `Review ${label}: found a pattern that may expose data if misconfigured.`
    );
  }
}

console.log("Supabase migration safety verification");
console.log(`- Migration files checked: ${files.length}`);
console.log(
  `- Bathroom tables discovered: ${[...requiredTables].sort().join(", ")}`
);
console.log(
  `- Anon INSERT tables: ${anonInsertTables.size ? [...anonInsertTables].sort().join(", ") : "none"}`
);

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (failures.length > 0) {
  console.error("\nFailures:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  "\nPassed: RLS and public-policy boundaries match the approved local/staging contract."
);
