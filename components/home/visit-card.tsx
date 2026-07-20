import { IconCash, IconUsers } from "@tabler/icons-react";
import type { MarketEvent } from "@/lib/home/types";

const EVENT_ICON = {
  dividend: IconCash,
  subscribers: IconUsers,
} as const;

interface VisitCardProps {
  events: MarketEvent[];
}

function eventIconFor(event: MarketEvent) {
  return event.headline.toLowerCase().includes("dividend")
    ? EVENT_ICON.dividend
    : EVENT_ICON.subscribers;
}

export function VisitCard({ events }: VisitCardProps) {
  return (
    <div className="rounded-[18px] border border-border bg-surface p-4 shadow-card">
      {events.map((event, index) => {
        const Icon = eventIconFor(event);
        return (
          <div
            key={event.ticker}
            className={`flex items-start gap-2.5 rounded-[10px] px-2 py-2 hover:bg-surface-tint ${
              index === 0 ? "" : "border-t border-border"
            }`}
          >
            <div
              className={`mt-0.5 flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-md ${
                event.kind === "urgent"
                  ? "bg-amber-tint text-amber"
                  : "bg-surface-tint text-ink-soft"
              }`}
            >
              <Icon size={11} stroke={2} />
            </div>
            <p className="text-[13px] leading-snug text-ink">{event.headline}</p>
          </div>
        );
      })}
    </div>
  );
}
