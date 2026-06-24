"use client";

import React from "react";
import {
  findPalette,
  findStyle,
  findTemplate
} from "@/data/public/bathroom-design-poc";
import { getDesignConstraintPrompts } from "@/lib/bathroom-design/constraints";
import { evidenceReadinessSummary } from "@/lib/bathroom-design/evidence-readiness";
import { getLayoutRiskPrompts } from "@/lib/bathroom-design/layout-risk";
import { BathroomDesignDraft } from "@/lib/bathroom-design/schema";

export function getDesignSummaryText(draft: BathroomDesignDraft) {
  const style = findStyle(draft.styleId);
  const palette = findPalette(draft.paletteId);
  const template = findTemplate(draft.startingPoint.sampleTemplateId);
  const selectedVariant = draft.variants.find((variant) => variant.id === draft.selectedVariantId);
  const layoutPrompts = draft.layoutRiskPrompts.length ? draft.layoutRiskPrompts : getLayoutRiskPrompts(draft.layoutPlanning);
  const constraintPrompts = draft.constraintPrompts.length ? draft.constraintPrompts : getDesignConstraintPrompts(draft);
  const evidenceSummary = evidenceReadinessSummary(draft.evidenceReadiness);
  return [
    "Operon Bathroom Design Studio concept summary",
    `Draft: ${draft.id}`,
    `Bathroom type: ${draft.bathroomType}`,
    `Starting point: ${draft.startingPoint.kind}${template ? ` (${template.name})` : ""}`,
    `Style: ${style?.name ?? draft.styleId}`,
    `Palette: ${palette?.name ?? draft.paletteId}`,
    `Selected concept: ${selectedVariant?.name ?? draft.selectedVariantId}`,
    `Allowance band: ${draft.allowanceBand}`,
    `Approximate room shape: ${draft.layoutPlanning.roomShape}`,
    `Approximate size band: ${draft.layoutPlanning.sizeBand}`,
    `Fixture zones: ${draft.layoutPlanning.fixtureZones.map((item) => item.label).join(", ")}`,
    `Planning checks: ${layoutPrompts.length ? layoutPrompts.map((item) => item.title).join(", ") : "No extra layout prompts from selected options"}`,
    `Constraint prompts: ${constraintPrompts.map((item) => item.title).join(", ")}`,
    `Evidence readiness: ${evidenceSummary.prepared} prepared, ${evidenceSummary.planned} planned, ${evidenceSummary.missing} missing`,
    `Evidence items: ${draft.evidenceReadiness.map((item) => `${item.label} (${item.status})`).join(", ")}`,
    `Photo used: ${draft.startingPoint.photoUsed ? "Yes, browser memory only" : "No"}`,
    `Conceptual selections: ${draft.conceptualSelections.map((item) => item.label).join(", ")}`,
    `Catalogue candidates: ${draft.productShortlist.map((item) => item.label).join(", ")}`,
    "This is an inspiration visual and approximate layout guide only.",
    "It is not a quote, measured plan, specification, contract or construction document.",
    "Catalogue candidates are not confirmed SKUs, supplier feeds, prices or procurement items.",
    "Constraint prompts are deterministic planning guidance from bounded inputs only; they do not use AI, external providers, source media or personal data.",
    "Evidence readiness is user-supplied and unverified online; no media is uploaded or stored by this checklist.",
    "Site measure, selections, licensed-trade checks and written scope confirmation are required before contract pricing."
  ].join("\n");
}

export function DesignSummary({ draft }: { draft: BathroomDesignDraft }) {
  const style = findStyle(draft.styleId);
  const palette = findPalette(draft.paletteId);
  const selectedVariant = draft.variants.find((variant) => variant.id === draft.selectedVariantId);
  const layoutPrompts = draft.layoutRiskPrompts.length ? draft.layoutRiskPrompts : getLayoutRiskPrompts(draft.layoutPlanning);
  const constraintPrompts = draft.constraintPrompts.length ? draft.constraintPrompts : getDesignConstraintPrompts(draft);
  const evidenceSummary = evidenceReadinessSummary(draft.evidenceReadiness);

  return (
    <div className="design-brief" id="design-brief">
      <p className="pill">Printable brief</p>
      <h2>Concept summary</h2>
      <div className="grid two">
        <div>
          <h3>Direction</h3>
          <ul>
            <li>Bathroom type: {draft.bathroomType}</li>
            <li>Style: {style?.name ?? draft.styleId}</li>
            <li>Palette: {palette?.name ?? draft.paletteId}</li>
            <li>Selected concept: {selectedVariant?.name ?? draft.selectedVariantId}</li>
            <li>Allowance band: {draft.allowanceBand}</li>
            <li>Approximate layout: {draft.layoutPlanning.roomShape}, {draft.layoutPlanning.sizeBand}</li>
          </ul>
        </div>
        <div>
          <h3>Catalogue candidates</h3>
          <ul>
            {draft.productShortlist.map((item) => (
              <li key={item.candidateId}>
                {item.label}: {item.finishFamily}. {item.evidencePrompt}
              </li>
            ))}
          </ul>
          <p className="muted">
            Candidate only. Not a confirmed SKU, supplier feed, price, availability check or procurement item.
          </p>
        </div>
      </div>
      <div>
        <h3>Approximate fixture zones</h3>
        <ul>
          {draft.layoutPlanning.fixtureZones.map((zone) => (
            <li key={`${zone.fixtureType}-${zone.label}`}>
              {zone.label}: {zone.approximatePosition}, service change {zone.serviceChange}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Planning checks to clarify</h3>
        {layoutPrompts.length ? (
          <ul>
            {layoutPrompts.map((prompt) => (
              <li key={prompt.id}>
                {prompt.title}: {prompt.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No extra layout prompts from selected options. Site review is still required before written scope confirmation.</p>
        )}
      </div>
      <div>
        <h3>Deterministic constraint prompts</h3>
        <ul>
          {constraintPrompts.map((prompt) => (
            <li key={prompt.id}>
              <strong>{prompt.title}:</strong> {prompt.message}
              {prompt.evidenceToPrepare.length ? (
                <span> Prepare: {prompt.evidenceToPrepare.join(", ")}.</span>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="muted">
          Generated from bounded planning inputs only. No AI, external provider, source media,
          personal data, pricing or compliance certification is used.
        </p>
      </div>
      <div>
        <h3>Evidence readiness</h3>
        <p className="muted">
          {evidenceSummary.prepared} prepared, {evidenceSummary.planned} planned and {evidenceSummary.missing} missing.
          Evidence statuses are user-supplied and unverified online.
        </p>
        <ul>
          {draft.evidenceReadiness.map((item) => (
            <li key={item.id}>
              <strong>{item.label}:</strong> {item.status}. {item.prompt}
            </li>
          ))}
        </ul>
        <p className="muted">
          No evidence media is uploaded or stored by this checklist. Site measure confirmation is still required.
        </p>
      </div>
      <div className="notice">
        <strong>Boundary</strong>
        <p>
          This brief is not a quote, measured plan, specification, contract or construction
          document. It is a local planning aid only.
        </p>
      </div>
    </div>
  );
}
