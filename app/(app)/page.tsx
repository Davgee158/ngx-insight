import { HomeStateResolver } from "@/components/home/home-state-resolver";
import { getDiscoverCompanies } from "@/lib/discover/companies";
import {
  getLatestSharePriceObservations,
  type StoredMarketObservation,
} from "@/lib/data-import/observation-repository";
import type {
  HomeDirectoryCompany,
  HomePriceObservation,
} from "@/lib/home/home-data-adapter";

function toPriceObservation(
  observation: StoredMarketObservation | undefined,
): HomePriceObservation | null {
  if (
    !observation ||
    observation.metric_key !== "share_price" ||
    observation.unit !== "NGN_per_share" ||
    observation.status !== "available" ||
    observation.verification_status === "not_assessed" ||
    observation.value === null ||
    !observation.source_name ||
    !observation.source_locator
  ) {
    return null;
  }

  const value = Number(observation.value);
  if (!Number.isFinite(value) || value <= 0) return null;

  return {
    value,
    observationDate: observation.observation_date ?? observation.retrieved_on,
    sourceName: observation.source_name,
    sourceLocator: observation.source_locator,
  };
}

export default async function HomePage() {
  const [companies, priceObservations] = await Promise.all([
    getDiscoverCompanies(),
    getLatestSharePriceObservations(),
  ]);
  const pricesByCompanyId = new Map(
    priceObservations.map((observation) => [observation.company_id, observation]),
  );
  const directory: HomeDirectoryCompany[] = companies.map((company) => ({
    ...company,
    priceObservation: toPriceObservation(pricesByCompanyId.get(company.companyId)),
  }));

  return <HomeStateResolver directory={directory} />;
}
