import type { WatchlistCompany } from "@/lib/watchlist/types";
import { getDiscoverCompanies } from "@/lib/discover/companies";
import {
  getLatestFinancialPeriods,
  getLatestSharePriceObservations,
} from "@/lib/data-import/observation-repository";

export async function getWatchlistDirectory(): Promise<WatchlistCompany[]> {
  const companies = await getDiscoverCompanies();
  const companyIds = companies.map((company) => company.companyId);
  const [priceObservations, financialPeriods] = await Promise.all([
    getLatestSharePriceObservations(),
    getLatestFinancialPeriods(companyIds),
  ]);
  const pricesByCompanyId = new Map(
    priceObservations.map((observation) => [observation.company_id, observation]),
  );
  const periodsByCompanyId = new Map(
    financialPeriods.map(({ company_id, period_end }) => [company_id, period_end]),
  );

  return companies.map((company) => {
    const priceObservation = pricesByCompanyId.get(company.companyId);
    const sharePrice =
      priceObservation?.value !== null && priceObservation?.value !== undefined
        ? Number(priceObservation.value)
        : Number.NaN;
    const periodEnd = periodsByCompanyId.get(company.companyId);

    return {
      companyId: company.companyId,
      slug: company.slug,
      ticker: company.ngxSymbol,
      stateKey: company.appStateKey,
      name: company.name,
      sector: company.category,
      sharePrice: Number.isFinite(sharePrice) ? sharePrice : null,
      sharePriceDate: priceObservation?.observation_date ?? null,
      sharePriceSourceName: priceObservation?.source_name ?? null,
      sharePriceSourceLocator: priceObservation?.source_locator ?? null,
      lastFinancialPeriod: periodEnd ? `FY${periodEnd.slice(0, 4)}` : null,
    };
  });
}
