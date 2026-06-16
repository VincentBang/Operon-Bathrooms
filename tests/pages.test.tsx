import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";
import HomePage from "../app/page";
import CostGuidePage from "../app/bathroom-renovation-cost-sydney/page";

test("home page renders planning-only positioning", () => {
  const html = renderToString(<HomePage />);

  assert.match(html, /Bathroom renovation planning before the quote/);
  assert.match(html, /Guidance, not a final quote/);
});

test("cost guide renders compliance prompts", () => {
  const html = renderToString(<CostGuidePage />);

  assert.match(html, /Bathroom renovation cost Sydney/);
  assert.match(html, /contractor licensing above \$5k/);
  assert.match(html, /not legal advice/);
});
