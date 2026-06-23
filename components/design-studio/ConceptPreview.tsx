"use client";

import React from "react";
import { BathroomDesignPalette } from "@/data/public/bathroom-design-poc";
import { BathroomDesignVariant } from "@/lib/bathroom-design/schema";

export function ConceptPreview({
  palette,
  variant,
  selected,
  onSelect
}: {
  palette: BathroomDesignPalette;
  variant: BathroomDesignVariant;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`concept-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      type="button"
      aria-pressed={selected}
    >
      <span className="concept-art" aria-label={`${variant.name} inspiration visual`}>
        <span className={`concept-room concept-${variant.emphasis}`}>
          <span style={{ background: palette.colours.base }} />
          <span style={{ background: palette.colours.surface }} />
          <span style={{ background: palette.colours.accent }} />
          <span style={{ background: palette.colours.metal }} />
        </span>
      </span>
      <span className="concept-card-copy">
        <strong>{variant.name}</strong>
        <span>{variant.summary}</span>
        <small>Inspiration visual only. Not a measured plan.</small>
      </span>
    </button>
  );
}
