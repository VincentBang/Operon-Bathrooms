import assert from "node:assert/strict";
import test from "node:test";
import { calculateEstimate } from "../lib/estimate";
import { defaultWizardInput } from "../lib/estimate-schema";

test("calculateEstimate returns a public planning range without private rates", () => {
  const result = calculateEstimate({
    ...defaultWizardInput,
    suburb: "Marrickville",
    contact: { name: "Ada Lovelace", email: "ada@example.com", phone: "0400000000" }
  });

  assert.equal(typeof result.range.low, "number");
  assert.equal(typeof result.range.high, "number");
  assert.ok(result.range.high > result.range.low);
  assert.match(result.range.label, /\$[0-9,]+ - \$[0-9,]+/);
  assert.ok(result.confidenceScore <= 100);
  assert.ok(result.compliancePrompts.some((prompt) => prompt.includes("$5k")));
  assert.ok(result.compliancePrompts.some((prompt) => prompt.includes("HBCF")));
  assert.equal(JSON.stringify(result).includes("adjustments"), false);
  assert.equal(JSON.stringify(result).includes("lowMultiplier"), false);
});

test("high-risk scope lowers confidence and returns risk flags", () => {
  const result = calculateEstimate({
    ...defaultWizardInput,
    suburb: "Newtown",
    homeAge: "pre-1980",
    condition: "poor",
    layoutChange: "move-wet-area",
    strata: true,
    asbestosConcern: "possible",
    access: "difficult",
    contact: { name: "Grace Hopper", email: "grace@example.com", phone: "0400000001" }
  });

  assert.equal(result.confidenceLabel, "Low");
  assert.ok(result.riskFlags.length >= 4);
});
