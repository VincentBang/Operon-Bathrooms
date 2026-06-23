"use client";

import React from "react";
import { getLayoutRiskPrompts } from "@/lib/bathroom-design/layout-risk";
import { BathroomDesignDraft } from "@/lib/bathroom-design/schema";

type LayoutPlanning = BathroomDesignDraft["layoutPlanning"];

const fixtureShortLabels: Record<LayoutPlanning["fixtureZones"][number]["fixtureType"], string> = {
  shower: "Shower",
  bath: "Bath",
  vanity: "Vanity",
  toilet: "Toilet",
  laundry: "Laundry",
  storage: "Storage",
  door: "Door",
  window: "Window",
  ventilation: "Vent",
  "waste-drain": "Drain"
};

function layoutClass(layout: LayoutPlanning) {
  return [
    "approx-layout-plan",
    `shape-${layout.roomShape}`,
    `size-${layout.sizeBand}`,
    `entry-${layout.entryPosition}`
  ].join(" ");
}

function zoneClass(zone: LayoutPlanning["fixtureZones"][number]) {
  return [
    "approx-layout-zone",
    `fixture-${zone.fixtureType}`,
    `position-${zone.approximatePosition}`,
    `status-${zone.status}`
  ].join(" ");
}

export function ApproximateLayoutPreview({ layout }: { layout: LayoutPlanning }) {
  const riskPrompts = getLayoutRiskPrompts(layout);

  return (
    <figure
      className="approx-layout-preview"
      aria-labelledby="approx-layout-title"
      aria-describedby="approx-layout-description"
    >
      <figcaption>
        <p className="pill" id="approx-layout-title">Approximate planning layout</p>
        <p id="approx-layout-description">
          Not a measured plan, construction drawing, compliance check or build-ready layout.
        </p>
      </figcaption>
      <div className={layoutClass(layout)} role="img" aria-label={`Approximate ${layout.roomShape} bathroom layout with ${layout.fixtureZones.length} fixture zones`}>
        <span className="approx-layout-entry" aria-hidden="true">Entry</span>
        {layout.fixtureZones.map((zone) => (
          <span className={zoneClass(zone)} key={`${zone.fixtureType}-${zone.label}`}>
            <strong>{fixtureShortLabels[zone.fixtureType]}</strong>
            <small>{zone.serviceChange}</small>
          </span>
        ))}
      </div>
      <dl className="approx-layout-meta">
        <div>
          <dt>Shape</dt>
          <dd>{layout.roomShape}</dd>
        </div>
        <div>
          <dt>Size band</dt>
          <dd>{layout.sizeBand}</dd>
        </div>
        <div>
          <dt>Door entry</dt>
          <dd>{layout.entryPosition}</dd>
        </div>
      </dl>
      {riskPrompts.length ? (
        <div className="layout-risk-panel">
          <h3>Planning checks to clarify</h3>
          <ul className="mini-list">
            {riskPrompts.map((prompt) => (
              <li key={prompt.id}>
                <strong>{prompt.title}:</strong> {prompt.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="layout-risk-panel">
          <h3>Planning checks to clarify</h3>
          <p>No extra layout prompts from the selected options. Site review is still required before written scope confirmation.</p>
        </div>
      )}
      <p className="muted">
        These prompts are general planning guidance only. They do not confirm compliance,
        buildability, waterproofing status or final scope.
      </p>
      <p className="muted">
        Site measure, selections, licensed-trade checks and written scope confirmation are required
        before contract pricing.
      </p>
    </figure>
  );
}
