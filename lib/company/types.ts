import type { Section } from "@/lib/home/types";
import type { StoredMarketObservation } from "@/lib/data-import/observation-repository";

export type SectionStatus = "done" | "next" | "todo";

export type SectionListKey = Section | "compare";

export interface CompanySectionStatus {
  key: SectionListKey;
  status: SectionStatus;
}

export type CompanyRelationship = "none" | "watching" | "held";

/**
 * Whole-app lifecycle, not per-company. "introduction" is the default for a
 * new user; the first commitment action anywhere (watchlist add, purchase
 * logged, pass recorded, a section review completed) flips it to "active"
 * for good. Mocked per test slug for now — there's no real shared/persisted
 * state across pages yet.
 */
export type UserPhase = "introduction" | "active";

export interface PeerComparisonRow {
  metric: string;
  period: string;
  companyValue: string;
  peerValue: string;
  companyEvidence: PeerEvidenceReference;
  peerEvidence: PeerEvidenceReference;
}

export interface PeerEvidenceReference {
  sourceName: string;
  sourceLocator: string;
  sourceLabel: string;
  basis: string | null;
  statementScope: string | null;
  verificationStatus: string;
}

export interface ComparePeer {
  ticker: string;
  slug: string;
  name: string;
  sector: string;
  comparableMetrics: number;
  comparisonBreakdown: PeerComparisonRow[];
}

export interface QuickCheckItem {
  kind: "strength" | "watch" | "insufficient";
  category: string;
  text: string;
}

export interface SectionMetric {
  label: string;
  value: string;
  /** Beginner-facing analysis area within the existing Company Analysis section. */
  category?: string;
  history?: MetricHistoryPoint[];
  evidence?: {
    unit: string;
    period: string;
    observationDate: string | null;
    sourceValue: string | null;
    sourceUnit: string | null;
    sourceName: string | null;
    sourceLocator: string | null;
    sourceLabel: string | null;
    basis: string | null;
    verificationStatus: string;
  };
  /** Comparison-direction badge text, e.g. "Above sector", "Below sector". */
  comparisonLabel?: string;
  /** Whether that comparison is the favorable side — not literally "high"/"low". */
  qualifier?: "favorable" | "unfavorable";
}

export interface MetricHistoryPoint {
  period: string;
  value: string | null;
  unit: string;
  status:
    | "available"
    | "missing"
    | "unavailable"
    | "not_applicable"
    | "conflicting"
    | "stale"
    | "no_observation_stored"
    | "incomplete_source";
  evidence?: NonNullable<SectionMetric["evidence"]>;
}

export interface SectionDetailContent {
  /** The single question this section answers. */
  question: string;
  metrics: SectionMetric[];
  insight: string;
  /** A one-off fact that doesn't fit the metric-pair shape (e.g. dividend history). */
  note?: { label: string; text: string };
}

export interface QuickCheckCriterion {
  text: string;
  met: boolean;
  status?: "met" | "watch" | "insufficient";
  evidence?: QuickCheckEvidence;
  /** Inline expansion text for screening checks (e.g. governance flags) that don't map to a metric. */
  checkDetail?: string;
}

export interface QuickCheckEvidence {
  period: string;
  value: string;
  unit: string;
  sourceValue: string | null;
  sourceUnit: string | null;
  sourceLabel: string;
  sourceName: string;
  sourceLocator: string;
  basis: string | null;
  verificationStatus: string;
}

export interface QuickCheckGroup {
  title: string;
  criteria: QuickCheckCriterion[];
}

export interface QuickCheckBreakdown {
  groups: QuickCheckGroup[];
  disclaimer: string;
}

export interface Position {
  shares: number;
  avgPrice: number;
}

export interface CompanyAnalysis {
  companyId?: string;
  ticker: string;
  displaySymbol?: string;
  name: string;
  sector: string;
  relationship: CompanyRelationship;
  userPhase: UserPhase;
  sectionStatus: CompanySectionStatus[];
  /** Stored source observations, retaining status and provenance. */
  observations?: StoredMarketObservation[];
  thesisSummary?: string;
  quickCheck?: QuickCheckItem[];
  quickCheckBreakdown?: QuickCheckBreakdown;
  comparePeers?: ComparePeer[];
  sectionDetails?: Partial<Record<Section, SectionDetailContent>>;
  /** Historical fact, independent of `relationship` — passing doesn't lock out Portfolio/Watchlist. */
  passedAt?: string;
  passReason?: string;
  /** Whether the user has opened the Quick Check breakdown — an alternate path to "engaged enough to buy" alongside reading a section. Mocked; no real interaction tracking exists yet. */
  quickCheckViewed?: boolean;
  /** Today's market close — used to pre-fill the Buy/Sell sheets. */
  currentPrice?: number;
  currentPriceObservation?: StoredMarketObservation;
  /** Held shares + average cost — required once `relationship === "held"` to power the Sell sheet. */
  position?: Position;
}

export const SECTION_LIST_META: Record<
  SectionListKey,
  { name: string; description: string; tag: "core" | "optional" }
> = {
  business: {
    name: "The Business",
    description: "What it does, who its customers are, and how it makes money",
    tag: "core",
  },
  "financial-health": {
    name: "Financial Health",
    description: "Revenue, profit, and debt over the last few years",
    tag: "core",
  },
  valuation: {
    name: "Valuation",
    description: "Whether the current price looks fair, cheap, or expensive",
    tag: "core",
  },
  risks: {
    name: "Risks",
    description: "What could go wrong, and how likely it is",
    tag: "core",
  },
  compare: {
    name: "How It Compares",
    description: "How this business stacks up against others in its sector",
    tag: "optional",
  },
};
