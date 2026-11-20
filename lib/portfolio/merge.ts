import type { EngagementEntry } from "@/lib/app-state/types";
import type { StoredMarketObservation } from "@/lib/data-import/observation-repository";
import type { Position } from "./types";

function priceValue(
  observation: StoredMarketObservation | undefined,
): number | undefined {
  if (
    !observation ||
    observation.metric_key !== "share_price" ||
    observation.unit !== "NGN_per_share" ||
    observation.status !== "available" ||
    observation.value === null ||
    observation.verification_status === "not_assessed"
  ) {
    return undefined;
  }

  const value = Number(observation.value);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function mergePositions(
  entries: Record<string, EngagementEntry>,
  currentPrices: Record<string, StoredMarketObservation>,
): Position[] {
  const positions: Position[] = [];

  for (const entry of Object.values(entries)) {
    if (entry.relationship !== "held" || !entry.position) continue;

    const key = entry.ticker.toLowerCase();
    const observation = currentPrices[key];
    const currentPrice = priceValue(observation);
    const hasPrice = currentPrice !== undefined;
    const validCostBasis = entry.position.avgPrice > 0;

    positions.push({
      ticker: entry.ticker,
      name: entry.name,
      sector: entry.sector,
      shares: entry.position.shares,
      currentPrice: hasPrice ? currentPrice : null,
      currentValue: hasPrice ? entry.position.shares * currentPrice : null,
      costBasis: entry.position.shares * entry.position.avgPrice,
      returnPct:
        hasPrice && validCostBasis
          ? ((currentPrice - entry.position.avgPrice) / entry.position.avgPrice) * 100
          : null,
      sharePriceDate: hasPrice
        ? observation?.observation_date ?? observation?.retrieved_on ?? null
        : null,
    });
  }

  return positions;
}
