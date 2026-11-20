import type { SectorView } from "./types";

export const MOCK_SECTOR_VIEWS: Record<string, SectorView> = {
  banking: {
    slug: "banking",
    name: "Banking",
    icon: "building-bank",
    description:
      "Explore the approved banking and mortgage banking issuers using the financial observations available in NGX Insight. Coverage varies by company and year, and reported definitions or scopes may differ.",
    compareDimensions: [
      {
        icon: "chart-line",
        name: "Profitability",
        note: "How much the bank actually earns from its lending",
      },
      {
        icon: "shield",
        name: "Capital strength",
        note: "The cushion the bank keeps for hard times",
      },
      {
        icon: "checks",
        name: "Loan quality",
        note: "Whether borrowers are paying back on time",
      },
      {
        icon: "coins",
        name: "Annual dividend yield",
        note: "Whether it consistently returns money to shareholders",
      },
    ],
  },
};
