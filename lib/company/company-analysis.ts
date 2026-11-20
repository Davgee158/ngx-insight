import "server-only";

import {
  getCompanyIdentities,
  getCompanyIdentity,
  getCompanyObservations,
  getCompanyObservationsForCompanies,
  getLatestSharePriceObservations,
  type StoredMarketObservation,
} from "@/lib/data-import/observation-repository";
import { adaptObservationsToSectionDetails } from "./analysis-adapter";
import { buildQuickCheck } from "./quick-check-adapter";
import {
  COMPANY_CONFIG_BY_ID,
  COMPANY_CONFIG_BY_SLUG,
} from "./company-config";
import { deriveSectionStatus } from "./section-status";
import { buildPeerComparisons } from "./peer-comparison-adapter";
import type { CompanyAnalysis } from "./types";

function getLatestSharePrice(
  observations: StoredMarketObservation[],
): StoredMarketObservation | undefined {
  return observations
    .filter(
      (observation) =>
        observation.metric_key === "share_price" &&
        observation.unit === "NGN_per_share" &&
        observation.status === "available" &&
        observation.value !== null &&
        observation.verification_status !== "not_assessed",
    )
    .sort((left, right) => {
      const leftDate = left.observation_date ?? left.retrieved_on ?? "";
      const rightDate = right.observation_date ?? right.retrieved_on ?? "";
      const dateOrder = rightDate.localeCompare(leftDate);
      if (dateOrder !== 0) return dateOrder;

      const captureOrder = (right.retrieved_at ?? "").localeCompare(
        left.retrieved_at ?? "",
      );
      if (captureOrder !== 0) return captureOrder;
      return Number(right.id) - Number(left.id);
    })[0];
}

export async function getCompanyAnalysis(
  slug: string,
): Promise<CompanyAnalysis | null> {
  const config = COMPANY_CONFIG_BY_SLUG[slug];
  if (!config) return null;

  const [identity, observations] = await Promise.all([
    getCompanyIdentity(config.companyId),
    getCompanyObservations(config.companyId),
  ]);

  if (!identity) return null;

  const currentPriceObservation = getLatestSharePrice(observations);
  const currentPrice =
    currentPriceObservation?.value !== null &&
    currentPriceObservation?.value !== undefined
      ? Number(currentPriceObservation.value)
      : undefined;
  const quickCheck = buildQuickCheck(observations);
  const peerIds = Object.values(COMPANY_CONFIG_BY_ID)
    .filter(
      (candidate) =>
        candidate.sector === config.sector &&
        candidate.companyId !== config.companyId,
    )
    .map((candidate) => candidate.companyId);
  const [peerObservations, peerIdentities] = await Promise.all([
    getCompanyObservationsForCompanies(peerIds),
    getCompanyIdentities(peerIds),
  ]);

  return {
    companyId: identity.company_id,
    ticker: config.appStateKey,
    displaySymbol: config.ngxSymbol,
    name: identity.company_name,
    sector: config.sector,
    relationship: "none",
    userPhase: "introduction",
    sectionStatus: deriveSectionStatus([]),
    observations,
    sectionDetails: adaptObservationsToSectionDetails(observations),
    quickCheck: quickCheck.items,
    quickCheckBreakdown: quickCheck.breakdown,
    comparePeers: buildPeerComparisons(
      identity.company_id,
      [...observations, ...peerObservations],
      peerIdentities,
    ),
    currentPrice:
      currentPrice !== undefined && Number.isFinite(currentPrice)
        ? currentPrice
        : undefined,
    currentPriceObservation,
  };
}

export async function getCompanyCurrentPrices(): Promise<
  Record<string, StoredMarketObservation>
> {
  const observations = await getLatestSharePriceObservations();
  const prices: Record<string, StoredMarketObservation> = {};

  for (const observation of observations) {
    const config = COMPANY_CONFIG_BY_ID[observation.company_id];
    const value = observation.value === null ? Number.NaN : Number(observation.value);

    if (config && Number.isFinite(value)) {
      // Keep the complete dated/source observation; portfolio state still uses
      // its app ticker as an in-memory key while database reads use company_id.
      prices[config.appStateKey.toLowerCase()] = observation;
    }
  }

  return prices;
}
