import type { Section } from "@/lib/home/types";
import type { StoredMarketObservation } from "@/lib/data-import/observation-repository";
import type {
  MetricHistoryPoint,
  SectionDetailContent,
  SectionMetric,
} from "./types";
import { formatCompanyValue } from "./format-value";

type MetricMapping = { key: string; label: string; category: string };

const METRICS_BY_SECTION: Record<Section, MetricMapping[]> = {
  business: [
    { key: "total_assets", label: "Total assets", category: "Balance sheet" },
    { key: "customer_deposits", label: "Customer deposits", category: "Balance sheet" },
    { key: "gross_loans", label: "Gross loans", category: "Balance sheet" },
    { key: "loans_to_deposits_ratio", label: "Loans-to-deposits ratio", category: "Lending position" },
  ],
  "financial-health": [
    { key: "net_income", label: "Net income", category: "Profitability" },
    { key: "roe", label: "Return on equity", category: "Profitability" },
    { key: "roa", label: "Return on assets", category: "Profitability" },
    { key: "net_interest_income", label: "Net interest income", category: "Income generation" },
    { key: "non_interest_income", label: "Non-interest income", category: "Income generation" },
    { key: "operating_income", label: "Operating income", category: "Income generation" },
    { key: "revenue_growth", label: "Revenue growth", category: "Growth" },
    { key: "net_income_growth", label: "Net income growth", category: "Growth" },
    { key: "cost_to_income_ratio", label: "Cost-to-income ratio", category: "Efficiency" },
  ],
  valuation: [
    { key: "share_price", label: "Share price", category: "Market price" },
    { key: "pe_ratio", label: "Price to earnings", category: "Valuation" },
    { key: "pb_ratio", label: "Price to book", category: "Valuation" },
    { key: "eps", label: "Earnings per share", category: "Valuation" },
    { key: "dividend_yield", label: "Dividend yield", category: "Dividends" },
  ],
  risks: [
    { key: "npl_ratio", label: "Non-performing loan ratio", category: "Asset quality" },
    { key: "loan_loss_coverage_ratio", label: "Loan-loss coverage ratio", category: "Asset quality" },
    { key: "capital_adequacy_ratio", label: "Capital adequacy ratio", category: "Capital strength" },
  ],
};

const SECTION_COPY: Record<
  Section,
  { question: string; empty: string; populated: string }
> = {
  business: {
    question: "What do the reported balance-sheet figures show?",
    empty: "No eligible balance-sheet observations are available yet.",
    populated:
      "These are reported balance-sheet figures. The source, period, and reporting scope are shown with each value.",
  },
  "financial-health": {
    question: "What financial results and ratios has the company reported?",
    empty: "No eligible financial observations are available for this section yet.",
    populated:
      "These are published observations, not calculated growth rates or peer judgments. Check each period and reporting basis when comparing values.",
  },
  valuation: {
    question: "What market values and valuation measures are published?",
    empty: "No eligible market or valuation observations are available yet.",
    populated:
      "Market measures retain the provider's period label and basis. Current and historical observations are shown separately.",
  },
  risks: {
    question: "What credit and regulatory ratios has the company reported?",
    empty: "No eligible risk or regulatory observations are available yet.",
    populated:
      "Reported ratios may use different scopes or regulatory definitions. They are shown without assigning a strength or risk judgment.",
  },
};

function periodLabel(observation: StoredMarketObservation): string {
  if (observation.target_period) return observation.target_period;
  if (observation.period_end) return observation.period_end.slice(0, 4);
  return observation.observation_date ?? "Period not stated";
}

function comparePeriods(
  left: StoredMarketObservation,
  right: StoredMarketObservation,
): number {
  const leftDate = left.observation_date ?? left.period_end ?? "";
  const rightDate = right.observation_date ?? right.period_end ?? "";
  if (leftDate !== rightDate) return rightDate.localeCompare(leftDate);
  return (right.target_period ?? "").localeCompare(left.target_period ?? "");
}

function isDisplayable(observation: StoredMarketObservation): boolean {
  return (
    observation.status === "available" &&
    observation.value !== null &&
    observation.source_name !== null &&
    observation.source_label !== null &&
    observation.source_locator !== null &&
    observation.verification_status !== "not_assessed"
  );
}

function toHistoryPoint(
  observation: StoredMarketObservation,
): MetricHistoryPoint {
  const displayable = isDisplayable(observation);
  return {
    period: periodLabel(observation),
    value:
      displayable && observation.value !== null
        ? formatCompanyValue(observation.value, observation.unit)
        : null,
    unit: observation.unit,
    status: displayable ? observation.status : observation.status === "available"
      ? "incomplete_source"
      : observation.status,
    evidence:
      observation.source_name || observation.source_label || observation.source_locator
        ? {
      unit: observation.unit,
      period: periodLabel(observation),
      observationDate: observation.observation_date,
      sourceValue: observation.source_value,
      sourceUnit: observation.source_unit,
      sourceName: observation.source_name,
      sourceLocator: observation.source_locator,
      sourceLabel: observation.source_label,
      basis: observation.basis,
      verificationStatus: observation.verification_status,
          }
        : undefined,
  };
}

const ANNUAL_METRICS = new Set(
  Object.values(METRICS_BY_SECTION)
    .flat()
    .map(({ key }) => key)
    .filter((key) => !["share_price", "pe_ratio", "pb_ratio"].includes(key)),
);

const ANNUAL_PERIODS = [2021, 2022, 2023, 2024, 2025].map(
  (year) => `FY${year}`,
);

function mapMetric(
  mapping: MetricMapping,
  observations: StoredMarketObservation[],
): SectionMetric {
  const points = observations.map(toHistoryPoint);
  const annualPeriods = ANNUAL_METRICS.has(mapping.key)
    ? ANNUAL_PERIODS.flatMap((period): MetricHistoryPoint[] => {
        const observed = points.filter((point) => periodForPoint(point) === period);
        return observed.length > 0
          ? observed
          : [{ period, value: null, unit: "", status: "no_observation_stored" }];
      })
    : [];
  const annualPeriodLabels = new Set(ANNUAL_PERIODS);
  const otherPeriods = ANNUAL_METRICS.has(mapping.key)
    ? points.filter((point) => !annualPeriodLabels.has(periodForPoint(point)))
    : points;
  const history = [...annualPeriods, ...otherPeriods];
  const latestValue = [...points]
    .filter((point) => point.status === "available" && point.value !== null)
    .sort((left, right) => right.period.localeCompare(left.period))[0]?.value;

  return {
    category: mapping.category,
    label: mapping.label,
    value: latestValue ?? "No observation stored",
    history,
  };
}

function periodForPoint(point: MetricHistoryPoint): string {
  if (/^FY20\d{2}$/.test(point.period)) return point.period;
  const year = point.period.match(/(?:FY|Dec\s*)?(20\d{2})/i)?.[1];
  return year ? `FY${year}` : point.period;
}

export function adaptObservationsToSectionDetails(
  observations: StoredMarketObservation[],
): Partial<Record<Section, SectionDetailContent>> {
  return Object.fromEntries(
    (Object.keys(METRICS_BY_SECTION) as Section[]).map((section) => {
      const copy = SECTION_COPY[section];
      const metrics: SectionMetric[] = METRICS_BY_SECTION[section].flatMap((mapping) => {
          const allMatching = observations
            .filter((observation) => observation.metric_key === mapping.key)
            .sort(comparePeriods);
          return allMatching.length > 0 || ANNUAL_METRICS.has(mapping.key)
            ? [mapMetric(mapping, allMatching)]
            : [];
        });

      return [
        section,
        {
          question: copy.question,
          metrics,
          insight: metrics.length > 0 ? copy.populated : copy.empty,
        } satisfies SectionDetailContent,
      ];
    }),
  );
}
