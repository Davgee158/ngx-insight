import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import type { ComparePeer } from "@/lib/company/types";
import type { Sector } from "@/lib/discover/types";
import { sectorSlug } from "@/lib/discover/slug";
import { TickerBadge } from "@/components/company/ticker-badge";

export function CompareWithSection({
  slug,
  comparePeers,
  companySector,
}: {
  slug: string;
  comparePeers: ComparePeer[];
  companySector: Sector | undefined;
}) {
  return (
    <div>
      <p className="mb-1 font-serif text-[16px] font-medium tracking-[-0.01em] text-ink">
        Compare With
      </p>
      <p className="mb-3.5 text-[12px] text-ink-mute">
        Compare published values where period, unit, scope, label, and basis match.
      </p>
      {comparePeers.length === 0 ? (
        <p className="mb-4 rounded-[14px] border border-border bg-surface p-4 text-[12px] leading-[1.5] text-ink-mute">
          No peers currently have enough matching, sourced observations for a comparison.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto">
          {comparePeers.map((peer) => (
            <Link
              key={peer.slug}
              href={`/company/${slug}/compare/${peer.slug}`}
              className="flex w-[220px] flex-shrink-0 flex-col gap-2.5 rounded-[18px] border border-border bg-surface p-4 shadow-card transition-colors hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              <div className="flex items-center gap-2.5">
                <TickerBadge ticker={peer.ticker} tone="indigo" />
                <div>
                  <p className="text-[13.5px] font-semibold text-ink">{peer.name}</p>
                  <p className="text-[11px] text-ink-mute">{peer.sector}</p>
                </div>
              </div>
              <p className="text-[12.5px] leading-[1.5] text-ink">
                {peer.comparableMetrics} comparable {peer.comparableMetrics === 1 ? "metric" : "metrics"} available
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5">
                <span className="text-[11px] text-ink-mute">Sourced values</span>
                <span className="flex items-center gap-1 text-[11.5px] font-medium text-indigo-deep">
                  Compare
                  <IconArrowRight size={12} stroke={1.75} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {companySector && (
        <Link
          href={`/discover/sector/${sectorSlug(companySector.name)}`}
          className="mt-3.5 flex items-center justify-center gap-1.5 rounded-[14px] border border-border bg-surface p-[13px] text-[12.5px] font-medium text-indigo-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          See all {companySector.count} {companySector.name.toLowerCase()} companies
          <IconArrowRight size={14} stroke={1.75} />
        </Link>
      )}
    </div>
  );
}
