import type { WeeklyTheme } from "@/lib/discover/types";

export async function getWeeklyTheme(): Promise<WeeklyTheme> {
  return {
    sectors: ["Banking"],
    cue: "This week",
  };
}
