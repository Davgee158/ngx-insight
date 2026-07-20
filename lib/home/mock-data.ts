import type {
  Holding,
  HomeUser,
  MarketEvent,
  Opportunity,
  PortfolioSummary,
  WatchlistEntry,
} from "./types";

export const MOCK_USER: HomeUser = {
  name: "Dave",
  initials: "DG",
};

export const DISCOVERY_SECTORS = [
  { label: "Banking", icon: "building-bank", active: true },
  { label: "Telecom", icon: "antenna", active: false },
  { label: "Consumer", icon: "shopping-bag", active: false },
  { label: "Energy", icon: "bolt", active: false },
] as const;

export const MOCK_WATCHLIST: WatchlistEntry[] = [
  {
    ticker: "GTCO",
    name: "GTCO",
    sector: "Banking",
    reviewedSections: ["business", "financial-health", "valuation"],
  },
];

export const MOCK_HOLDINGS: Holding[] = [
  { ticker: "GTCO", name: "GTCO", sector: "Banking" },
];

export const MOCK_PRIMARY_EVENT: MarketEvent = {
  ticker: "GTCO",
  companyName: "GTCO",
  headline: "One of your holdings released earnings yesterday.",
  kind: "neutral",
};

export const MOCK_SECONDARY_EVENTS: MarketEvent[] = [
  {
    ticker: "ZENITHBANK",
    companyName: "Zenith Bank",
    headline:
      "Zenith Bank declared a dividend — you'll need to decide whether to reinvest.",
    kind: "urgent",
  },
  {
    ticker: "MTNN",
    companyName: "MTNN",
    headline: "MTNN's subscriber base grew faster than expected this quarter.",
    kind: "neutral",
  },
];

export const MOCK_PORTFOLIO_SUMMARY: PortfolioSummary = {
  trendLabel: "up modestly",
  sparkline: [1, 0, 4, 3, 8, 6, 11, 9, 14],
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    ticker: "SW",
    name: "Seplat Energy",
    sector: "Energy",
    insight:
      "Revenue grew 21% last quarter, and the business still looks under-the-radar.",
    sparkline: [0, 2, 1, 5, 4, 8, 7, 10],
    minutes: 5,
  },
  {
    ticker: "DB",
    name: "Dangote Cement",
    sector: "Industrial",
    insight: "Margins have improved for three straight quarters as costs ease.",
    sparkline: [1, 0, 3, 2, 5, 4, 7, 6],
    minutes: 6,
  },
];
