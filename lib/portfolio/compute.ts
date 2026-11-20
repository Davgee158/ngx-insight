import type { ConcentrationSlice, Position, PortfolioSummary } from "./types";

function sortDescending(slices: ConcentrationSlice[]): ConcentrationSlice[] {
  return [...slices].sort((a, b) => b.pct - a.pct);
}

export function computeSectorConcentration(
  positions: Position[],
): ConcentrationSlice[] {
  const pricedPositions = positions.filter(
    (position) => position.currentValue !== null,
  );
  const total = pricedPositions.reduce(
    (sum, position) => sum + position.currentValue!,
    0,
  );
  if (total === 0) return [];

  const bySector: Record<string, number> = {};
  for (const position of pricedPositions) {
    bySector[position.sector] =
      (bySector[position.sector] ?? 0) + position.currentValue!;
  }

  const slices = Object.entries(bySector).map(([name, value]) => ({
    name,
    pct: (value / total) * 100,
  }));

  return sortDescending(slices);
}

export function computePositionConcentration(
  positions: Position[],
): ConcentrationSlice[] {
  const pricedPositions = positions.filter(
    (position) => position.currentValue !== null,
  );
  const total = pricedPositions.reduce(
    (sum, position) => sum + position.currentValue!,
    0,
  );
  if (total === 0) return [];

  const slices = pricedPositions.map((position) => ({
    name: position.name,
    meta: position.sector,
    pct: (position.currentValue! / total) * 100,
  }));

  return sortDescending(slices);
}

export function computePortfolioSummary(
  positions: Position[],
): PortfolioSummary {
  const pricedPositions = positions.filter(
    (position) => position.currentValue !== null,
  );
  if (pricedPositions.length === 0) {
    return {
      currentValue: null,
      invested: null,
      totalReturnAmount: null,
      totalReturnPct: null,
    };
  }

  const currentValue = pricedPositions.reduce(
    (sum, position) => sum + position.currentValue!,
    0,
  );

  const invested = pricedPositions.reduce(
    (sum, position) => sum + position.costBasis,
    0,
  );
  const totalReturnAmount = currentValue - invested;
  const totalReturnPct =
    invested !== 0 ? (totalReturnAmount / invested) * 100 : null;

  return { currentValue, invested, totalReturnAmount, totalReturnPct };
}
