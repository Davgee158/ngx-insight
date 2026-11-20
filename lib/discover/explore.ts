import { Explore } from "@/lib/discover/types";
import { MOCK_EXPLORE } from "@/lib/discover/mock-data";

export async function getExploreData(): Promise<Explore[]> {
  return MOCK_EXPLORE;
}
