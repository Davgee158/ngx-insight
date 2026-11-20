import {
  IconReportMoney,
  IconSearch,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";

export function PortfolioEmptyState() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium tracking-tight mb-4">
        Nothing recorded yet.
      </h1>
      <div className="bg-surface border border-border rounded-lg shadow-hero p-[26px_22px] mb-[22px]">
        <div className="mb-3.5 flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-indigo-tint text-indigo-deep">
          <IconReportMoney size={20} stroke={1.75} />
        </div>

        <div>
          <h2 className="mb-2 font-serif text-[20px] font-medium tracking-[-0.015em] leading-[1.25] text-ink">
            A record of what you&apos;ve decided to invest in, and whether
            those decisions still hold.
          </h2>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            Once you log a purchase, this becomes the place to check in. Not
            to chase performance day to day, just to see if your reasoning
            still stands.
          </p>
        </div>
      </div>
      <Link
        href="/discover"
        className="flex items-center gap-3.5 rounded-md border border-border bg-surface p-[14px_16px] text-left shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
      >
        <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] bg-surface-tint text-ink-soft">
          <IconSearch size={16} stroke={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-0.5 text-[13.5px] font-semibold text-ink">
            Already own shares?
          </h3>
          <p className="text-[11.5px] leading-[1.4] text-ink-mute">
            Find the company in Discover, open its analysis, then choose Buy to
            record your holding.
          </p>
        </div>
        <IconChevronRight
          size={16}
          stroke={1.75}
          className="flex-shrink-0 text-ink-mute"
        />
      </Link>
    </div>
  );
}
