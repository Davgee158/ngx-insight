"use client";

import { useAppState } from "@/lib/app-state/app-state-context";
import type { WatchlistCompany } from "@/lib/watchlist/types";
import { WatchlistList } from "@/components/watchlist/watchlistList";

export function WatchlistResolver({
  initialCompanies,
}: {
  initialCompanies: WatchlistCompany[];
}) {
  const { state } = useAppState();
  const companiesById = new Map(
    initialCompanies.map((company) => [company.companyId, company]),
  );
  const seenCompanyIds = new Set<string>();
  const companies = Object.values(state.entries).flatMap((entry) => {
    if (
      entry.relationship !== "watching" ||
      !entry.companyId ||
      seenCompanyIds.has(entry.companyId)
    ) {
      return [];
    }

    const company = companiesById.get(entry.companyId);
    if (!company) return [];
    seenCompanyIds.add(entry.companyId);

    return [{ ...company, stateKey: entry.ticker }];
  });

  return <WatchlistList initialCompanies={companies} />;
}
