import { MOCK_SECTOR_VIEWS } from "./sector-view-mock-data";
import type { SectorView } from "./types";

export async function getSectorView(slug: string): Promise<SectorView | null> {
  return MOCK_SECTOR_VIEWS[slug] ?? null;
}
