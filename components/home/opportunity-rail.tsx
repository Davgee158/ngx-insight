import { IconArrowRight } from "@tabler/icons-react";
import type { Opportunity } from "@/lib/home/types";
import { OpportunityCard } from "./opportunity-card";

interface OpportunityRailProps {
  heading: string;
  subheading: string;
  opportunities: Opportunity[];
}

export function OpportunityRail({
  heading,
  subheading,
  opportunities,
}: OpportunityRailProps) {
  return (
    <div>
      <p className="mb-1 font-serif text-lg font-medium tracking-tight text-ink">
        {heading}
      </p>
      <p className="mb-3.5 text-[13px] text-ink-mute">{subheading}</p>
      <div className="-mx-5 flex gap-3.5 overflow-x-auto px-5 pb-1">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.ticker} opportunity={opportunity} />
        ))}
      </div>
      <div className="mt-3.5 flex items-center justify-center gap-1.5 rounded-xl border border-border p-3 text-[13px] font-medium text-ink hover:bg-surface-tint">
        Browse companies
        <IconArrowRight size={14} />
      </div>
    </div>
  );
}
