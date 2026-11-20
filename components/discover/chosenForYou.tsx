import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";
import type { CompanySnippet } from "@/lib/discover/types";
import { TickerBadge } from "@/components/company/ticker-badge";

interface ChosenForYouCardProps {
  companySnippet: CompanySnippet;
}

export function ChosenForYouCard({ companySnippet }: ChosenForYouCardProps) {
  return (
    <div className="flex w-[260px] flex-shrink-0 flex-col gap-3 rounded-[18px] border border-border bg-surface p-4 shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-float">
      <div className="flex items-center gap-2.5">
        <TickerBadge ticker={companySnippet.ticker} size="small" />
        <div>
          <div className="text-[13px] font-semibold text-ink">
            {companySnippet.name}
          </div>
          <div className="text-[11px] text-ink-mute">
            {companySnippet.sector}
          </div>
        </div>
      </div>
      <div>
        <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-deep">
          <IconSparkles size={11} stroke={1.75} />
          Similar to {companySnippet.similarTo}
        </div>
        <p className="mt-1 text-sm font-medium leading-snug text-ink">
          {companySnippet.insight}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <span className="text-[11px] text-ink-mute">
          {companySnippet.minutes} min read
        </span>
        <Link
          href="/discover/coming-soon"
          className="flex items-center gap-0.5 rounded-sm text-[13px] font-medium text-indigo-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          Research
        </Link>
      </div>
    </div>
  );
}
