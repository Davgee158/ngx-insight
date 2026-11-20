"use client";

import { useAppState } from "@/lib/app-state/app-state-context";
import { deriveSectionStatus } from "@/lib/company/section-status";
import { COMPANY_CONFIG_BY_SLUG } from "@/lib/company/company-config";
import type { CompanyAnalysis } from "@/lib/company/types";
import type { Sector } from "@/lib/discover/types";
import { CompanyHubView } from "@/components/company/companyHubView";

function hasAnyEngagement(entries: Record<string, { relationship: string; reviewedSections: unknown[] }>) {
  return Object.values(entries).some(
    (entry) => entry.relationship !== "none" || entry.reviewedSections.length > 0,
  );
}

export function CompanyHubResolver({
  slug,
  staticCompany,
  sectors,
}: {
  slug: string;
  staticCompany: CompanyAnalysis;
  sectors: Sector[];
}) {
  const { state, addToWatchlist, removeFromWatchlist, recordBuy, recordSell } =
    useAppState();
  const ticker = staticCompany.ticker.toLowerCase();
  const companyId =
    staticCompany.companyId ?? COMPANY_CONFIG_BY_SLUG[slug]?.companyId;
  const entry = state.entries[ticker];
  const base = {
    companyId,
    ticker,
    name: staticCompany.name,
    sector: staticCompany.sector,
  };

  const company: CompanyAnalysis = {
    ...staticCompany,
    relationship: entry?.relationship ?? "none",
    sectionStatus: deriveSectionStatus(entry?.reviewedSections ?? []),
    userPhase: hasAnyEngagement(state.entries) ? "active" : "introduction",
    position: entry?.position,
  };

  function handleWatchlistChange(nextWatching: boolean) {
    if (nextWatching) {
      addToWatchlist(base);
    } else {
      removeFromWatchlist(ticker);
    }
  }

  function handleBuyConfirm(shares: number, avgPrice: number) {
    recordBuy(base, shares, avgPrice);
  }

  function handleSellConfirm(sharesSold: number) {
    recordSell(ticker, sharesSold);
  }

  return (
    <CompanyHubView
      slug={slug}
      company={company}
      sectors={sectors}
      onWatchlistChange={handleWatchlistChange}
      onBuyConfirm={handleBuyConfirm}
      onSellConfirm={handleSellConfirm}
    />
  );
}
