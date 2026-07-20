import { Sparkline } from "./sparkline";

interface PortfolioContextRowProps {
  trendLabel: string;
  sparkline: number[];
}

export function PortfolioContextRow({
  trendLabel,
  sparkline,
}: PortfolioContextRowProps) {
  return (
    <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
      <Sparkline
        data={sparkline}
        width={56}
        height={20}
        color="var(--color-green)"
        className="flex-shrink-0"
      />
      <div className="text-xs text-ink-mute">
        Your portfolio is <b className="font-medium text-ink-soft">{trendLabel}</b>{" "}
        this month.
      </div>
    </div>
  );
}
