import { MOCK_LENS_DETAILS } from "./mock-data";
import type { LensDetail } from "./types";

export async function getLensDetail(slug: string): Promise<LensDetail | null> {
  return MOCK_LENS_DETAILS[slug] ?? null;
}
