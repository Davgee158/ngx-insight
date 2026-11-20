import type {
  CompanySnippet,
  ChosenForYou,
  Sector,
  Lens,
  Explore,
  RecentUpdate,
  SectorRanking,
  SectorComparison,
  LensDetail,
} from "./types";

export const MOCK_CHOSEN_COMPANIES: CompanySnippet[] = [
  {
    ticker: "NB",
    name: "Nigerian Breweries",
    sector: "Consumer Goods",
    insight:
      "Another business where consistent margins matter more than headline growth.",
    minutes: 4,
    similarTo: "GTCO",
  },
  {
    ticker: "NL",
    name: "Nestlé Nigeria",
    sector: "Consumer Goods",
    insight:
      "Pricing power and brand loyalty do a lot of the work here, not volume growth.",
    minutes: 5,
    similarTo: "GTCO",
  },
  {
    ticker: "DC",
    name: "Dangote Cement",
    sector: "Industrial",
    insight:
      "Scale gives it cost advantages competitors have struggled to match.",
    minutes: 6,
    similarTo: "GTCO",
  },
];

export const MOCK_CHOSEN_FOR_YOU: ChosenForYou = {
  anchor: "GTCO",
  anchorReason:
    "Because you've been drawn to businesses with strong profitability.",
  companies: MOCK_CHOSEN_COMPANIES,
  computedAt: "2026-07-15T09:00:00Z",
};

export const MOCK_SECTORS: Sector[] = [
  { name: "Banking", icon: "building-bank", count: 14 },
  { name: "Telecom", icon: "antenna", count: 3 },
  { name: "Consumer", icon: "shopping-bag", count: 22 },
  { name: "Energy", icon: "flame", count: 9 },
  { name: "Industrial", icon: "building-factory-2", count: 11 },
  { name: "Healthcare", icon: "heart", count: 6 },
];

export const MOCK_LENSES: Lens[] = [
  {
    name: "Dividend Leaders",
    icon: "coins",
    tag: "Evergreen",
    description:
      "Companies that have shared profits with owners for years — and one or two you might not expect.",
    companyCount: 12,
    saved: true,
  },
  {
    name: "Revenue Growth",
    icon: "trending-up",
    tag: "Evergreen",
    description:
      "Businesses growing their top line faster than their sector — for reasons worth understanding.",
    companyCount: 9,
    saved: false,
  },
  {
    name: "Rate-Sensitive Businesses",
    icon: "shield",
    tag: "This week",
    isThemed: true,
    description:
      "Companies whose fortunes shift when interest rates change — sometimes for the better, sometimes not.",
    companyCount: 8,
    saved: false,
  },
];

export const MOCK_EXPLORE: Explore[] = [
  {
    kicker: "Business model",
    title: "Businesses that can raise prices without losing customers.",
    description:
      "Why some companies get to name their price — and how you can spot the pattern.",
    companyCount: 3,
    saved: false,
  },
  {
    kicker: "Business model",
    title: "Companies that benefit when oil prices move.",
    description:
      "Producers and heavy users react in opposite directions to the same shift. Which side wins depends on more than you'd expect.",
    companyCount: 4,
    saved: false,
  },
];

export const MOCK_SECTOR_RANKINGS: SectorRanking[] = [
  {
    slug: "banking",
    name: "Banking",
    icon: "building-bank",
    ytdReturnPct: 18.4,
    reason:
      "Rising interest income and strong dividend payouts have kept banks near the top this year.",
  },
  {
    slug: "telecom",
    name: "Telecom",
    icon: "antenna",
    ytdReturnPct: 11.2,
    reason:
      "Subscriber growth continues, but currency pressure has squeezed margins.",
  },
  {
    slug: "consumer",
    name: "Consumer",
    icon: "shopping-bag",
    ytdReturnPct: 6.7,
    reason: "Input costs have eased slightly, giving margins room to recover.",
  },
  {
    slug: "energy",
    name: "Energy",
    icon: "flame",
    ytdReturnPct: -4.1,
    reason:
      "Global price volatility has weighed on the sector for most of the year.",
  },
];

export const MOCK_SECTOR_COMPARISONS: Record<string, SectorComparison> = {
  "banking-vs-energy": {
    pairSlug: "banking-vs-energy",
    sectorASlug: "banking",
    sectorBSlug: "energy",
    sectorAName: "Banking",
    sectorBName: "Energy",
    diffLine:
      "Banking has led on returns this year; Energy has lagged, largely tracking global price swings rather than company-specific issues.",
    metrics: [
      { label: "YTD Return", valueA: "+18.4%", valueB: "−4.1%" },
      { label: "Avg P/E", valueA: "7.9x", valueB: "5.4x" },
      { label: "Avg Dividend Yield", valueA: "5.1%", valueB: "6.8%" },
      { label: "Avg ROE", valueA: "21.6%", valueB: "14.2%" },
    ],
    topCompanyA: "GTCO",
    topCompanyB: "Seplat Energy",
    basisNote:
      "Sector averages are calculated across all listed companies in each sector. This is context for exploring, not a signal to move money between sectors.",
  },
};

export const MOCK_LENS_DETAILS: Record<string, LensDetail> = {
  "dividend-leaders": {
    slug: "dividend-leaders",
    title: "Dividend Leaders",
    description:
      "Companies that have shared profits with owners for years — and one or two you might not expect. A consistent dividend history says something about how a business is run, not just how it's valued.",
    companies: [
      {
        ticker: "GT",
        name: "GTCO",
        note: "Paid a dividend every year for 8 consecutive years, including through the 2020 downturn.",
      },
      {
        ticker: "ZB",
        name: "Zenith Bank",
        note: "One of the more conservative payers in the sector, with a steadier — if lower — yield.",
      },
      {
        ticker: "MT",
        name: "MTN Nigeria",
        note: "A high payout ratio funded by strong, predictable cash flow from its core telecom business.",
      },
    ],
  },
};

export const MOCK_RECENT_UPDATES: RecentUpdate[] = [
  {
    name: "GTCO",
    isThemed: true,
    what: "Q3 earnings released — revenue up, margins steady",
    when: "2h ago",
  },
  {
    name: "Dangote Cement",
    what: "Cost analysis updated for the third quarter",
    when: "Yesterday",
  },
  {
    name: "Seplat Energy",
    what: "New context added on oil price sensitivity",
    when: "2 days ago",
  },
];
