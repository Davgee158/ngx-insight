"use client";

import { useState } from "react";
import type { ConcentrationSlice } from "@/lib/portfolio/types";

const SEGMENT_COLORS = [
  "bg-indigo-deep",
  "bg-indigo-mid",
  "bg-indigo-soft",
  "bg-surface-tint",
];

export function ConcentrationCard({
  sectorConcentration,
  positionConcentration,
}: {
  sectorConcentration: ConcentrationSlice[];
  positionConcentration: ConcentrationSlice[];
}) {
  const [activeTab, setActiveTab] = useState<"sector" | "position">("sector");
  const slices =
    activeTab === "sector" ? sectorConcentration : positionConcentration;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-card p-5 mb-5">
      <h2 className="font-serif text-[16px] tracking-[0.01em] mb-4">
        How concentrated is your portfolio?
      </h2>
      <div className="flex bg-surface-tint rounded-[10px] p-[3px] mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("sector")}
          className={`flex-1 text-center py-2 text-[12px] font-medium rounded-[7px] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
            activeTab === "sector" ? "bg-surface text-ink" : "text-ink-soft"
          }`}
        >
          By Sector
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("position")}
          className={`flex-1 text-center py-2 text-[12px] font-medium rounded-[7px] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
            activeTab === "position" ? "bg-surface text-ink" : "text-ink-soft"
          }`}
        >
          By Position
        </button>
      </div>
      <div className="flex h-[14px] rounded-[7px] overflow-hidden mb-3.5">
        {slices.map((slice, index) => (
          <div
            key={slice.name}
            className={`h-full ${SEGMENT_COLORS[index] ?? "bg-surface-tint"}`}
            style={{ width: `${slice.pct}%` }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {slices.map((slice, index) => (
          <div key={slice.name} className="flex items-center gap-[9px]">
            <span
              className={`h-[9px] w-[9px] flex-shrink-0 rounded-[2px] ${
                SEGMENT_COLORS[index] ?? "bg-surface-tint"
              } ${
                (SEGMENT_COLORS[index] ?? "bg-surface-tint") ===
                "bg-surface-tint"
                  ? "border border-border"
                  : ""
              }`}
            />
            <span className="flex-1 text-[12.5px] text-ink-soft">
              {slice.name}
            </span>
            {slice.meta && (
              <span className="mr-0.5 text-[11px] text-ink-mute">
                {slice.meta}
              </span>
            )}
            <span className="font-mono text-[12.5px] text-ink">
              {Math.round(slice.pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
