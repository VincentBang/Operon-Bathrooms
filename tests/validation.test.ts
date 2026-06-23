import assert from "node:assert/strict";
import test from "node:test";
import { defaultWizardInput, quoteWizardSchema } from "../lib/estimate-schema";

test("wizard validation rejects incomplete contact details", () => {
  const parsed = quoteWizardSchema.safeParse({
    ...defaultWizardInput,
    suburb: "Surry Hills",
    contact: { name: "", email: "bad-email", phone: "" }
  });

  assert.equal(parsed.success, false);
});

test("wizard validation accepts complete MVP input", () => {
  const parsed = quoteWizardSchema.safeParse({
    ...defaultWizardInput,
    suburb: "Surry Hills",
    contact: { name: "Test Lead", email: "lead@example.com", phone: "0400000000" }
  });

  assert.equal(parsed.success, true);
});
