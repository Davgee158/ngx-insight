import { IconPlus } from "@tabler/icons-react";
import type { CompanyAnalysis } from "@/lib/company/types";
import { WatchlistBookmark } from "@/components/company/watchlistBookmark";
import { RemoveFromWatchlistButton } from "@/components/company/removeFromWatchlistButton";
import { BuySheet } from "@/components/company/buySheet";
import { SellSheet } from "@/components/company/sellSheet";

export function AnalysisActionStack({
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
    <div className="mt-[18px] flex flex-col gap-2 border-t border-border pt-[18px]">
      {company.currentPrice !== undefined ? (
          <BuySheet
            companyName={company.name}
            currentPrice={company.currentPrice}
            triggerLabel={isHeld ? "Buy more" : "Buy"}
            onConfirm={onBuyConfirm}
          />
        ) : (
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-1.5 rounded-[12px] bg-ink p-[13px] text-[13.5px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconPlus size={15} stroke={1.75} />
            {isHeld ? "Buy more" : "Buy"}
          </button>
        )}
      {isHeld &&
        (company.position && company.currentPrice !== undefined ? (
          <SellSheet
            companyName={company.name}
            currentPrice={company.currentPrice}
            position={company.position}
            onConfirm={onSellConfirm}
          />
        ) : (
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-border bg-transparent p-[13px] text-[13.5px] font-medium text-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sell some or all
          </button>
        ))}
      {showWatchlistCta && (
        <WatchlistBookmark
          companyName={company.name}
          initialSaved={false}
          onToggle={onWatchlistChange}
        />
      )}
      {showRemoveFromWatchlist && (
        <RemoveFromWatchlistButton
          companyName={company.name}
          onToggle={onWatchlistChange}
        />
      )}
    </div>
  );
}
