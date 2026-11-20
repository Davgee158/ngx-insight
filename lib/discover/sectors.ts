import { MOCK_SECTORS } from "@/lib/discover/mock-data";
import { getWeeklyTheme } from "@/lib/discover/theme";
import type { Sector } from "@/lib/discover/types";

export async function getSectors(): Promise<Sector[]> {
  const theme = await getWeeklyTheme();

  return MOCK_SECTORS.map((sector) =>
    theme.sectors.includes(sector.name)
      ? { ...sector, themedCue: theme.cue }
      : sector,
  );
}
