"use client";

import { useState } from "react";
import { IconArrowsRightLeft } from "@tabler/icons-react";
import type { SectorComparison } from "@/lib/discover/types";

export function SectorComparisonCard({
  comparison,
}: {
  comparison: SectorComparison;
}) {
  const [swapped, setSwapped] = useState(false);

  const left = swapped
    ? { name: comparison.sectorBName, topCompany: comparison.topCompanyB }
    : { name: comparison.sectorAName, topCompany: comparison.topCompanyA };
  const right = swapped
    ? { name: comparison.sectorAName, topCompany: comparison.topCompanyA }
    : { name: comparison.sectorBName, topCompany: comparison.topCompanyB };

  return (
    <div>
      <div className="mb-1 flex items-center gap-2.5">
        <span className="font-serif text-[15px] font-medium text-ink">
          {left.name}
        </span>
        <span className="text-[12px] font-medium text-ink-mute">vs</span>
        <span className="font-serif text-[15px] font-medium text-ink">
          {right.name}
        </span>
        <button
          type="button"
          onClick={() => setSwapped((current) => !current)}
          aria-label="Switch sides"
          className="ml-auto flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-indigo-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          <IconArrowsRightLeft size={13} stroke={1.75} />
          Switch
        </button>
      </div>

      <p className="mt-2.5 text-[13px] leading-[1.5] text-ink-soft">
        {comparison.diffLine}
      </p>

      <table className="mt-[18px] w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-border py-2 pr-1 text-left text-[10.5px] font-medium text-ink-mute">
              Metric
            </th>
            <th className="border-b border-border px-1 py-2 text-center text-[10.5px] font-medium text-ink-mute">
              {left.name}
            </th>
            <th className="border-b border-border px-1 py-2 text-center text-[10.5px] font-medium text-ink-mute">
              {right.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {comparison.metrics.map((metric) => (
            <tr key={metric.label}>
              <td className="border-b border-surface-tint py-2.5 pr-1 text-[12px] text-ink-soft">
                {metric.label}
              </td>
              <td className="border-b border-surface-tint px-1 py-2.5 text-center font-mono text-[13px] text-ink">
                {swapped ? metric.valueB : metric.valueA}
              </td>
              <td className="border-b border-surface-tint px-1 py-2.5 text-center font-mono text-[13px] text-ink">
                {swapped ? metric.valueA : metric.valueB}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5">
        <p className="mb-2 text-[11.5px] font-semibold text-ink">
          Largest company by market cap
        </p>
        <div className="flex justify-between border-t border-surface-tint py-1.5 text-[12.5px]">
          <span className="text-ink-soft">{left.name}</span>
          <span className="font-medium text-ink">{left.topCompany}</span>
        </div>
        <div className="flex justify-between border-t border-surface-tint py-1.5 text-[12.5px]">
          <span className="text-ink-soft">{right.name}</span>
          <span className="font-medium text-ink">{right.topCompany}</span>
        </div>
      </div>

      <p className="mt-3.5 border-t border-border pt-3.5 text-[11px] leading-[1.5] text-ink-mute">
        {comparison.basisNote}
      </p>
    </div>
  );
}
