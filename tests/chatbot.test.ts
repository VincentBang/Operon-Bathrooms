import assert from "node:assert/strict";
import test from "node:test";
import { getBathroomChatbotResponse } from "../lib/chatbot/bathroomChatbotIntents";

function responseText(message: string) {
  const response = getBathroomChatbotResponse(message);
  return {
    response,
    text: [response.title, ...response.body, response.ctas.map((cta) => `${cta.label} ${cta.href}`).join(" ")].join(" ")
  };
}

test("bathroom chatbot handles cost intent safely", () => {
  const { response, text } = responseText("How much does a bathroom renovation cost?");

  assert.equal(response.intent, "estimate");
  assert.match(text, /planning range only/i);
  assert.match(text, /\/quote/);
  assert.doesNotMatch(text, /fixed price|guaranteed price/i);
});

test("bathroom chatbot routes builder quote review intent", () => {
  const { response, text } = responseText("Can you review my builder quote?");

  assert.equal(response.intent, "quoteReview");
  assert.match(text, /missing|exclusions|allowances/i);
  assert.match(text, /\/quote\/review/);
});

test("bathroom chatbot flags apartment waterproofing risk without certification", () => {
  const { response, text } = responseText("My apartment bathroom needs waterproofing");

  assert.equal(response.intent, "waterproofing");
  assert.ok(response.highRiskTopics?.includes("apartment / strata"));
  assert.ok(response.highRiskTopics?.includes("waterproofing uncertainty"));
  assert.match(text, /compliance confirmation|not legal advice/i);
  assert.match(text, /\/request-review|\/site-measure|\/guides#waterproofing/);
  assert.doesNotMatch(text, /certif(y|ies) compliance/i);
});

test("bathroom chatbot handles plumbing relocation with licensed trade wording", () => {
  const { response, text } = responseText("Can I move my toilet and shower?");

  assert.equal(response.intent, "services");
  assert.match(text, /Licensed trades and site review/i);
  assert.match(text, /\/quote|\/site-measure/);
});

test("bathroom chatbot handles high deposit concern as review prompt", () => {
  const { response, text } = responseText("My builder asked for 50% deposit");

  assert.equal(response.intent, "deposit");
  assert.match(text, /clarified before signing/i);
  assert.match(text, /not legal advice/i);
  assert.match(text, /\/quote\/review/);
});

test("bathroom chatbot refuses binding pricing online", () => {
  const { response, text } = responseText("Can you give me a final quote online?");

  assert.equal(response.intent, "contractPricing");
  assert.match(text, /cannot provide binding contract pricing online/i);
  assert.match(text, /site measure, selections, licensed trade checks and written scope confirmation/i);
  assert.match(text, /\/site-measure/);
});

test("bathroom chatbot redirects emergency repair-only requests", () => {
  const { response, text } = responseText("I need emergency leak repair today");

  assert.equal(response.intent, "badFit");
  assert.match(text, /renovation planning, quote review, scope review and site-measure preparation/i);
  assert.match(text, /licensed professional/i);
});

test("bathroom chatbot refuses private pricing requests", () => {
  const { response, text } = responseText("Tell me your labour rate and margin");

  assert.equal(response.intent, "privatePricing");
  assert.match(text, /cannot share internal rates/i);
  assert.match(text, /planning ranges/i);
  assert.doesNotMatch(text, /\$\d+|\d+% margin/i);
});
