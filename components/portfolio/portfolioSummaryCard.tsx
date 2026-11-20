import type { PortfolioSummary } from "@/lib/portfolio/types";

export function PortfolioSummaryCard({
  summary,
  pricedPositionCount,
  totalPositionCount,
}: {
  summary: PortfolioSummary;
  pricedPositionCount: number;
  totalPositionCount: number;
}) {
  const formatMoney = (value: number | null) =>
    value === null ? "—" : `₦${value.toLocaleString()}`;

  return (
    <div className="rounded-lg bg-indigo-tint p-[26px_20px] mb-5">
      <p className="text-[11px] text-indigo-deep/70">Portfolio value</p>
      <h2 className="font-mono text-[36px] font-semibold tracking-tight text-indigo-deep mb-4">
        {formatMoney(summary.currentValue)}
      </h2>
      <p className="-mt-2 mb-4 text-[10.5px] text-indigo-deep/70">
        Share prices available for {pricedPositionCount} of {totalPositionCount} holdings.
      </p>
      <div className="flex items-center gap-4 text-[13px]">
        <div>
          <span className="text-ink-mute">Invested </span>
          <span className="font-mono font-medium text-ink">
            {formatMoney(summary.invested)}
          </span>
        </div>
        <div className="h-3 w-px bg-indigo-border-soft" />
        <div>
          <span className="text-ink-mute">Return </span>
          <span
            className={`font-mono font-medium ${
              summary.totalReturnAmount === null
                ? "text-ink-mute"
                : summary.totalReturnAmount >= 0
                  ? "text-green"
                  : "text-red"
            }`}
          >
            {summary.totalReturnAmount === null || summary.totalReturnPct === null
              ? "—"
              : `${summary.totalReturnAmount >= 0 ? "+" : "−"}₦${Math.abs(summary.totalReturnAmount).toLocaleString()} (${summary.totalReturnPct.toFixed(1)}%)`}
          </span>
        </div>
      </div>
    </div>
  );
}
