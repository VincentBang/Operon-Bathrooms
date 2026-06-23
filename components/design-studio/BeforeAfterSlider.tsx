"use client";

import React from "react";

export function BeforeAfterSlider({
  imageUrl,
  overlayLabel,
  value,
  onChange
}: {
  imageUrl: string | null;
  overlayLabel: string;
  value: number;
  onChange: (value: number) => void;
}) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="before-after">
      <div className="before-after-frame">
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URLs cannot be optimized by next/image and are never uploaded. */}
        <img src={imageUrl} alt="User-selected bathroom reference kept in browser memory only" />
        <div className="before-after-overlay" style={{ width: `${value}%` }}>
          <span>{overlayLabel}</span>
        </div>
      </div>
      <label>
        Concept overlay amount
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
      <div className="segmented-control" aria-label="Non-drag before and concept controls">
        {[25, 50, 75, 100].map((amount) => (
          <button
            className={value === amount ? "secondary active" : "secondary"}
            key={amount}
            onClick={() => onChange(amount)}
            type="button"
          >
            {amount}%
          </button>
        ))}
      </div>
    </div>
  );
}
