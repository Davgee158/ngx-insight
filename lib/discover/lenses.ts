import { MOCK_LENSES } from "@/lib/discover/mock-data";
import { Lens } from "@/lib/discover/types";

export async function getLenses(): Promise<Lens[]> {
  return MOCK_LENSES;
}
