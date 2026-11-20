"use client";

import { useAppState } from "@/lib/app-state/app-state-context";
import { mergePositions } from "@/lib/portfolio/merge";
import {
  computePortfolioSummary,
  computeSectorConcentration,
  computePositionConcentration,
} from "@/lib/portfolio/compute";
import { groupPositions } from "@/lib/portfolio/grouping";
import type { StoredMarketObservation } from "@/lib/data-import/observation-repository";
import { PortfolioSummaryCard } from "@/components/portfolio/portfolioSummaryCard";
import { ConcentrationCard } from "@/components/portfolio/concentrationCard";
import { PositionsList } from "@/components/portfolio/positionsList";
import { PortfolioEmptyState } from "@/components/portfolio/portfolioEmptyState";
import type { Position } from "@/lib/portfolio/types";

export function PortfolioResolver({
  currentPrices,
}: {
  currentPrices: Record<string, StoredMarketObservation>;
}) {
  const { state, recordBuy, recordSell, removePosition } = useAppState();
  const positions = mergePositions(state.entries, currentPrices);
  const summary = computePortfolioSummary(positions);
  const sectorConcentration = computeSectorConcentration(positions);
  const positionConcentration = computePositionConcentration(positions);
  const pricedPositionCount = positions.filter(
    (position) => position.currentValue !== null,
  ).length;
  const hasPricedPositions = positions.some(
    (position) => position.currentValue !== null,
  );
  const { needsAttention, active } = groupPositions(positions);
  const activePositionCount = active.length + needsAttention.length;

  function findEntry(position: Position) {
    return Object.values(state.entries).find(
      (entry) => entry.ticker.toLowerCase() === position.ticker.toLowerCase(),
    );
  }

  function handleBuy(position: Position, shares: number, avgPrice: number) {
    const entry = findEntry(position);
    if (entry) recordBuy(entry, shares, avgPrice);
  }

  function handleSell(position: Position, sharesSold: number) {
    const entry = findEntry(position);
    if (entry) recordSell(entry.ticker, sharesSold);
  }

  function handleDelete(position: Position) {
    const entry = findEntry(position);
    if (entry) removePosition(entry.ticker);
  }

  if (positions.length === 0) {
    return <PortfolioEmptyState />;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium tracking-tight mb-4">
        {activePositionCount} {activePositionCount === 1 ? "position" : "positions"}.
      </h1>

      <PortfolioSummaryCard
        summary={summary}
        pricedPositionCount={pricedPositionCount}
        totalPositionCount={positions.length}
      />
      {hasPricedPositions && (
        <ConcentrationCard
          sectorConcentration={sectorConcentration}
          positionConcentration={positionConcentration}
        />
      )}
      <PositionsList
        positions={positions}
        onBuyConfirm={handleBuy}
        onSellConfirm={handleSell}
        onDelete={handleDelete}
      />
    </div>
  );
}
