import {
  MOCK_SECTOR_RANKINGS,
  MOCK_SECTOR_COMPARISONS,
} from "@/lib/discover/mock-data";
import type { SectorComparison, SectorRanking } from "@/lib/discover/types";

export async function getSectorRankings(): Promise<SectorRanking[]> {
  return [...MOCK_SECTOR_RANKINGS].sort(
    (a, b) => b.ytdReturnPct - a.ytdReturnPct,
  );
}

export async function getSectorComparison(
  pairSlug: string,
): Promise<SectorComparison | null> {
  return MOCK_SECTOR_COMPARISONS[pairSlug] ?? null;
}
