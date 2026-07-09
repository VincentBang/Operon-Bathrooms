import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";
import HomePage from "../app/page";
import CostGuidePage from "../app/bathroom-renovation-cost-sydney/page";
import BathroomQuoteSydneyPage from "../app/bathroom-quote-sydney/page";
import ApartmentStrataGuidePage from "../app/guides/apartment-bathroom-strata-review/page";
import ComplianceGuidePage from "../app/guides/bathroom-compliance-nsw/page";
import DepositGuidePage from "../app/guides/bathroom-deposit-limit-nsw/page";
import PcSumsGuidePage from "../app/guides/bathroom-pc-sums-provisional-sums/page";
import QuoteChecklistGuidePage from "../app/guides/bathroom-quote-checklist/page";
import QuoteVsEstimateGuidePage from "../app/guides/bathroom-quote-vs-estimate/page";
import LicenceGuidePage from "../app/guides/bathroom-renovation-licence-nsw/page";
import HbcfGuidePage from "../app/guides/home-building-compensation-insurance-bathrooms/page";
import SiteMeasureChecklistGuidePage from "../app/guides/site-measure-checklist/page";
import WaterproofingGuidePage from "../app/guides/waterproofing-and-bathroom-quotes/page";
import ProductSchedulePage from "../app/product-schedule/page";
import QuoteReviewPage from "../app/quote/review/page";
import RequestReviewPage from "../app/request-review/page";
import ApartmentBathroomPage from "../app/services/apartment-bathroom-renovation-sydney/page";
import BathroomRefreshPage from "../app/services/bathroom-refresh/page";
import SiteMeasurePage from "../app/site-measure/page";

test("home page renders planning-only positioning", () => {
  const html = renderToString(<HomePage />);

  assert.match(html, /Sydney bathroom renovation estimates and quote review before you commit/);
  assert.match(html, /Planning estimate only/);
  assert.match(html, /Site measure, selections, licensed trade checks and written scope confirmation/);
  assert.match(html, /Build product schedule/);
});

test("cost guide renders compliance prompts", () => {
  const html = renderToString(<CostGuidePage />);

  assert.match(html, /Bathroom Renovation Cost Guide for Sydney 2026/);
  assert.match(html, /contractor licensing above \$5k/);
  assert.match(html, /not legal advice/);
});

test("phase 2 pages render guidance-only positioning", () => {
  const quoteReview = renderToString(<QuoteReviewPage />);
  const requestReview = renderToString(<RequestReviewPage />);
  const siteMeasure = renderToString(<SiteMeasurePage />);

  assert.match(quoteReview, /Check what may be missing before you commit/);
  assert.match(quoteReview, /not legal advice/);
  assert.match(requestReview, /Request a bathroom scope review/);
  assert.match(siteMeasure, /Confirm the site before contract pricing/);
});

test("new phase 1 seo pages render safe routing copy", () => {
  const quoteLanding = renderToString(<BathroomQuoteSydneyPage />);
  const apartment = renderToString(<ApartmentBathroomPage />);
  const refresh = renderToString(<BathroomRefreshPage />);

  assert.match(quoteLanding, /Bathroom renovation quote Sydney/);
  assert.match(quoteLanding, /planning guidance only before contract pricing/);
  assert.match(apartment, /Apartment and strata bathroom renovations in Sydney/);
  assert.match(apartment, /Class 2 screening/);
  assert.match(refresh, /does not position around cheap or supply-only bathroom work/);
});

test("product schedule page renders planning-only product workflow", () => {
  const html = renderToString(<ProductSchedulePage />);

  assert.match(html, /Operon Bathroom Product Schedule/);
  assert.match(html, /Generate Bathroom Product Schedule/);
  assert.match(html, /not checkout/);
  assert.match(html, /Site measure, selections, licensed trade checks and written scope confirmation/);
});

test("phase 2 authority guides render safe SEO copy", () => {
  const quoteChecklist = renderToString(<QuoteChecklistGuidePage />);
  const waterproofing = renderToString(<WaterproofingGuidePage />);
  const allowances = renderToString(<PcSumsGuidePage />);
  const strata = renderToString(<ApartmentStrataGuidePage />);
  const siteMeasure = renderToString(<SiteMeasureChecklistGuidePage />);

  assert.match(quoteChecklist, /Bathroom quote checklist before you commit/);
  assert.match(quoteChecklist, /planning guidance only, not legal advice/);
  assert.match(waterproofing, /does not certify compliance/);
  assert.match(allowances, /does not expose internal rates/);
  assert.match(strata, /not legal advice/);
  assert.match(siteMeasure, /not a contract price/);
  assert.match(quoteChecklist, /"@type":"FAQPage"/);
  assert.match(waterproofing, /Online guidance cannot certify compliance/);
  assert.doesNotMatch(`${quoteChecklist}${waterproofing}${allowances}${strata}${siteMeasure}`, /supplier cost|rate card|final quote online/i);
});

test("remaining phase 2 NSW prompt guides render source-aware safe copy", () => {
  const quoteVsEstimate = renderToString(<QuoteVsEstimateGuidePage />);
  const compliance = renderToString(<ComplianceGuidePage />);
  const deposit = renderToString(<DepositGuidePage />);
  const hbcf = renderToString(<HbcfGuidePage />);
  const licence = renderToString(<LicenceGuidePage />);
  const combined = `${quoteVsEstimate}${compliance}${deposit}${hbcf}${licence}`;

  assert.match(quoteVsEstimate, /not contract pricing/);
  assert.match(compliance, /not legal advice or compliance certification/);
  assert.match(deposit, /10% of the contract price/);
  assert.match(hbcf, /jobs over \$20,000/);
  assert.match(licence, /over \$5,000 including GST/);
  assert.match(combined, /"@type":"FAQPage"/);
  assert.doesNotMatch(combined, /we provide legal advice|guaranteed compliance|final quote online|supplier cost|rate card/i);
});
