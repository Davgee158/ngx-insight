import { IconArrowRight } from "@tabler/icons-react";
import type { Opportunity } from "@/lib/home/types";
import { Sparkline } from "./sparkline";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <div className="flex w-[260px] flex-shrink-0 flex-col gap-3 rounded-[18px] border border-border bg-surface p-4 shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-float">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-ink text-[10.5px] font-semibold text-white">
          {opportunity.ticker}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-ink">
            {opportunity.name}
          </div>
          <div className="text-[11px] text-ink-mute">{opportunity.sector}</div>
        </div>
      </div>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-mute">
          Why it&apos;s worth a look
        </div>
        <p className="mt-1 text-sm font-medium leading-snug text-ink">
          {opportunity.insight}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Sparkline data={opportunity.sparkline} className="opacity-85" />
          <span className="font-mono text-[11px] text-ink-mute">
            {opportunity.minutes} min
          </span>
        </div>
        <div className="flex items-center gap-0.5 text-[13px] font-medium text-indigo-deep">
          View
          <IconArrowRight size={13} />
        </div>
      </div>
    </div>
  );
}
