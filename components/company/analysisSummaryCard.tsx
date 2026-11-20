import type { CompanyAnalysis } from "@/lib/company/types";
import { AnalysisActionStack } from "@/components/company/analysisActionStack";

export function AnalysisSummaryCard({
  company,
  isHeld,
  showWatchlistCta,
  showRemoveFromWatchlist,
  onWatchlistChange,
  onBuyConfirm,
  onSellConfirm,
}: {
  company: CompanyAnalysis;
  isHeld: boolean;
  showWatchlistCta: boolean;
  showRemoveFromWatchlist: boolean;
  onWatchlistChange?: (nextWatching: boolean) => void;
  onBuyConfirm?: (shares: number, avgPrice: number) => void;
  onSellConfirm?: (sharesSold: number) => void;
}) {
  return (
    <div className="mb-7 rounded-[24px] border border-border bg-surface p-[22px_20px] shadow-hero">
      <h1 className="mb-2.5 font-serif text-[20px] font-medium leading-[1.28] tracking-[-0.01em] text-ink">
        Understanding {company.name}.
      </h1>
      <p className="text-[13px] leading-[1.5] text-ink-soft">
        Review the company&apos;s reported information, periods, and sources in
        the sections below.
      </p>

      <AnalysisActionStack
        company={company}
        isHeld={isHeld}
        showWatchlistCta={showWatchlistCta}
        showRemoveFromWatchlist={showRemoveFromWatchlist}
        onWatchlistChange={onWatchlistChange}
        onBuyConfirm={onBuyConfirm}
        onSellConfirm={onSellConfirm}
      />
    </div>
  );
}
