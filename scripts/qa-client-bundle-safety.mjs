/* global console, process */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const staticDir = join(process.cwd(), ".next", "static");
const failures = [];
const warnings = [];
const scannedFiles = [];

const forbiddenPatterns = [
  ["service role key marker", /SUPABASE_SERVICE_ROLE_KEY|service_role|service role key/i],
  ["private rate card import", /data\/private|bathroom-rate-card/i],
  ["private rate-card field", /lowMultiplier|highMultiplier|layoutMoveWetArea|premiumFixtures|midFixtures|floorToCeilingTile|ventilationUpgrade|electricalUpgrade|plumbingUpgrade/i],
  ["private pricing implementation marker", /supplierCost|labou?rRate|marginLogic|internalPricingFormula/i]
];

const adminTerminologyPatterns = [
  ["admin qualification label", /leadFitScore|lead_fit_score|qualificationNotes|qualification_notes/i],
  ["admin manual report label", /manualReviewReport|manual_review_report|internalReviewNote|internal_review_note/i],
  ["admin internal notes label", /internalNotes|internal_notes/i]
];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!/\.(?:js|css|json|html|txt|map)$/.test(entry)) continue;
    scannedFiles.push(fullPath);
    const content = readFileSync(fullPath, "utf8");
    for (const [label, pattern] of forbiddenPatterns) {
      if (pattern.test(content)) {
        failures.push(`${fullPath.replace(process.cwd(), ".")}: ${label}`);
      }
    }
    for (const [label, pattern] of adminTerminologyPatterns) {
      if (pattern.test(content)) {
        warnings.push(`${fullPath.replace(process.cwd(), ".")}: ${label}`);
      }
    }
  }
}

if (!existsSync(staticDir)) {
  console.error("Missing .next/static. Run npm run build before npm run qa:bundle-safety.");
  process.exit(1);
}

walk(staticDir);

console.log(`Client bundle safety scan`);
console.log(`- Files scanned: ${scannedFiles.length}`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
  console.log("\nAdmin terminology can appear in the protected admin client chunk. This scan fails only on secret or private-pricing implementation markers.");
}

if (failures.length) {
  console.error("\nClient bundle safety failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nPassed: built client assets do not contain known private Operon Bathrooms markers.");
