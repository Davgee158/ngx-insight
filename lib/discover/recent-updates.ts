import { MOCK_RECENT_UPDATES } from "@/lib/discover/mock-data";
import type { RecentUpdate } from "@/lib/discover/types";

export async function getRecentUpdates(): Promise<RecentUpdate[]> {
  return MOCK_RECENT_UPDATES;
}
