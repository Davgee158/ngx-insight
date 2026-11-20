import type { CompanyAnalysis } from "@/lib/company/types";
import type { Sector } from "@/lib/discover/types";
import { CompanyHeader } from "@/components/company/companyHeader";
import { AnalysisSummaryCard } from "@/components/company/analysisSummaryCard";
import { QuickCheckCard } from "@/components/company/quickCheckCard";
import { SectionList } from "@/components/company/sectionList";
import { CompareWithSection } from "@/components/company/compareWithSection";

export function CompanyHubView({
  slug,
  company,
  sectors,
  onWatchlistChange,
  onBuyConfirm,
  onSellConfirm,
}: {
  slug: string;
  company: CompanyAnalysis;
  sectors: Sector[];
  onWatchlistChange?: (nextWatching: boolean) => void;
  onBuyConfirm?: (shares: number, avgPrice: number) => void;
  onSellConfirm?: (sharesSold: number) => void;
}) {
  const companySector = sectors.find(
    (sector) => sector.name === company.sector,
  );

  const relationship = company.relationship;
  const isHeld = relationship === "held";
  const isWatching = relationship === "watching";
  const isNone = relationship === "none";
  const showWatchlistCta = isNone;
  const showRemoveFromWatchlist = isWatching;
  const hasQuickCheck = Boolean(company.quickCheck?.length);

  return (
    <div className="px-5 pt-10 pb-10">
      <CompanyHeader company={company} />

      <div>
        <AnalysisSummaryCard
          company={company}
          isHeld={isHeld}
          showWatchlistCta={showWatchlistCta}
          showRemoveFromWatchlist={showRemoveFromWatchlist}
          onWatchlistChange={onWatchlistChange}
          onBuyConfirm={onBuyConfirm}
          onSellConfirm={onSellConfirm}
        />

        {hasQuickCheck && company.quickCheck && (
          <QuickCheckCard
            slug={slug}
            company={company}
            quickCheck={company.quickCheck}
          />
        )}

        <SectionList
          slug={slug}
          sectionStatus={company.sectionStatus}
        />

        <CompareWithSection
          slug={slug}
          comparePeers={company.comparePeers ?? []}
          companySector={companySector}
        />

      </div>
    </div>
  );
}
