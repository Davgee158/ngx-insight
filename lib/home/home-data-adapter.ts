import type { AppState } from "@/lib/app-state/types";
import type { DiscoverCompany } from "@/lib/discover/companies";

export interface HomePriceObservation {
  value: number;
  observationDate: string | null;
  sourceName: string;
  sourceLocator: string;
}

export interface HomeDirectoryCompany extends DiscoverCompany {
  priceObservation: HomePriceObservation | null;
}

export interface HomeCompanyItem {
  companyId: string;
  name: string;
  ticker: string;
  category: DiscoverCompany["category"];
  analysisHref: string;
  sharePrice: number | null;
  priceObservation: HomePriceObservation | null;
  shares?: number;
}

export interface HomeData {
  watchlistCompanies: HomeCompanyItem[];
  holdings: HomeCompanyItem[];
}

/** Joins browser-local relationships to the database-backed issuer directory. */
export function adaptHomeData(
  entries: AppState["entries"],
  directory: HomeDirectoryCompany[],
): HomeData {
  const companiesById = new Map(
    directory.map((company) => [company.companyId, company]),
  );
  const watchlistCompanies: HomeCompanyItem[] = [];
  const holdings: HomeCompanyItem[] = [];
  const seenWatchlistIds = new Set<string>();
  const seenHoldingIds = new Set<string>();

  for (const entry of Object.values(entries)) {
    if (!entry.companyId) continue;
    const company = companiesById.get(entry.companyId);
    if (!company) continue;

    const item: HomeCompanyItem = {
      companyId: company.companyId,
      name: company.name,
      ticker: company.ngxSymbol,
      category: company.category,
      analysisHref: `/company/${company.slug}`,
      sharePrice: company.priceObservation?.value ?? null,
      priceObservation: company.priceObservation,
    };

    if (entry.relationship === "watching" && !seenWatchlistIds.has(company.companyId)) {
      seenWatchlistIds.add(company.companyId);
      watchlistCompanies.push(item);
    }

    if (
      entry.relationship === "held" &&
      entry.position &&
      !seenHoldingIds.has(company.companyId)
    ) {
      seenHoldingIds.add(company.companyId);
      holdings.push({ ...item, shares: entry.position.shares });
    }
  }

  return { watchlistCompanies, holdings };
}
