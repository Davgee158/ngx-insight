export interface CompanySnippet {
  ticker: string;
  name: string;
  sector: string;
  insight: string;
  minutes: number;
  sparkline?: number[];
  similarTo?: string;
}

export interface ChosenForYou {
  anchor: string;
  anchorReason: string;
  companies: CompanySnippet[];
  computedAt: string;
}

export interface Sector {
  name: string;
  icon: string;
  count: number;
  themedCue?: string;
}

export interface WeeklyTheme {
  sectors: string[];
  cue: string;
}

export interface Lens {
  name: string;
  icon: string;
  tag: string;
  isThemed?: boolean;
  description: string;
  companyCount: number;
  saved: boolean;
}

export interface Explore {
  kicker: string;
  title: string;
  description: string;
  companyCount: number;
  saved: boolean;
}

export interface RecentUpdate {
  name: string;
  isThemed?: boolean;
  what: string;
  when: string;
}

export interface CompareDimension {
  icon: string;
  name: string;
  note: string;
}

export interface SectorView {
  slug: string;
  name: string;
  icon: string;
  description: string;
  compareDimensions: CompareDimension[];
}

export interface SectorRanking {
  slug: string;
  name: string;
  icon: string;
  ytdReturnPct: number;
  reason: string;
}

export interface SectorComparisonMetric {
  label: string;
  valueA: string;
  valueB: string;
}

export interface SectorComparison {
  pairSlug: string;
  sectorASlug: string;
  sectorBSlug: string;
  sectorAName: string;
  sectorBName: string;
  diffLine: string;
  metrics: SectorComparisonMetric[];
  topCompanyA: string;
  topCompanyB: string;
  basisNote: string;
}

export interface LensDetailCompany {
  ticker: string;
  name: string;
  note: string;
}

export interface LensDetail {
  slug: string;
  title: string;
  description: string;
  companies: LensDetailCompany[];
}
