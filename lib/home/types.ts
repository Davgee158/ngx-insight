export type Section = "business" | "financial-health" | "valuation" | "risks";

export const SECTION_ORDER: Section[] = [
  "business",
  "financial-health",
  "valuation",
  "risks",
];

export const SECTION_LABEL: Record<Section, string> = {
  business: "The Business",
  "financial-health": "Financial Health",
  valuation: "Valuation",
  risks: "Risks",
};

export interface WatchlistEntry {
  ticker: string;
  name: string;
  sector: string;
  reviewedSections: Section[];
}

export interface Holding {
  ticker: string;
  name: string;
  sector: string;
}

export interface MarketEvent {
  ticker: string;
  companyName: string;
  headline: string;
  kind: "urgent" | "neutral";
}

export interface Opportunity {
  ticker: string;
  name: string;
  sector: string;
  insight: string;
  sparkline: number[];
  minutes: number;
}

export interface PortfolioSummary {
  trendLabel: string;
  sparkline: number[];
}

export interface HomeUser {
  name: string;
  initials: string;
}
