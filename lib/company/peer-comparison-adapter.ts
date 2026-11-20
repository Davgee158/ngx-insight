import type { StoredMarketObservation } from "@/lib/data-import/observation-repository";
import { formatCompanyValue } from "./format-value";
import { COMPANY_ROUTE_CONFIGS } from "./company-config";
import type {
  ComparePeer,
  PeerComparisonRow,
  PeerEvidenceReference,
} from "./types";
import type { StoredCompanyIdentity } from "@/lib/data-import/observation-repository";

const LABELS: Record<string, string> = {
  net_income: "Net income",
  roe: "Return on equity",
  roa: "Return on assets",
  net_interest_income: "Net interest income",
  non_interest_income: "Non-interest income",
  revenue_growth: "Revenue growth",
  net_income_growth: "Net income growth",
  share_price: "Share price",
  pe_ratio: "Price to earnings",
  pb_ratio: "Price to book",
  eps: "Earnings per share",
  dividend_yield: "Dividend yield",
  npl_ratio: "Non-performing loan ratio",
  loan_loss_coverage_ratio: "Loan-loss coverage ratio",
  cost_to_income_ratio: "Cost-to-income ratio",
  loans_to_deposits_ratio: "Loans-to-deposits ratio",
  capital_adequacy_ratio: "Capital adequacy ratio",
};
const MARKET_METRICS = new Set([
  "share_price",
  "pe_ratio",
  "pb_ratio",
  "dividend_yield",
]);

function eligible(observation: StoredMarketObservation): boolean {
  return (
    observation.status === "available" &&
    observation.value !== null &&
    observation.source_name !== null &&
    observation.source_locator !== null &&
    observation.source_label !== null &&
    observation.verification_status !== "not_assessed"
  );
}

function periodKey(observation: StoredMarketObservation): string {
  if (observation.target_period) return observation.target_period.trim();
  if (observation.period_end) return observation.period_end;
  return observation.observation_date ?? "";
}

function periodSortKey(observation: StoredMarketObservation): string {
  return observation.period_end ?? observation.observation_date ?? periodKey(observation);
}

function compatible(
  company: StoredMarketObservation,
  peer: StoredMarketObservation,
): boolean {
  return (
    company.company_id !== peer.company_id &&
    company.metric_key === peer.metric_key &&
    periodKey(company) !== "" &&
    periodKey(company) === periodKey(peer) &&
    company.period_start === peer.period_start &&
    company.period_end === peer.period_end &&
    company.unit === peer.unit &&
    company.statement_scope === peer.statement_scope &&
    company.basis !== null &&
    peer.basis !== null &&
    company.source_label === peer.source_label &&
    company.basis === peer.basis &&
    (!MARKET_METRICS.has(company.metric_key) ||
      periodKey(company) !== "Current" ||
      (company.observation_date !== null &&
        company.observation_date === peer.observation_date))
  );
}

function evidenceReference(
  observation: StoredMarketObservation,
): PeerEvidenceReference {
  return {
    sourceName: observation.source_name ?? "",
    sourceLocator: observation.source_locator ?? "",
    sourceLabel: observation.source_label ?? "",
    basis: observation.basis,
    statementScope: observation.statement_scope,
    verificationStatus: observation.verification_status,
  };
}

function toRow(
  company: StoredMarketObservation,
  peer: StoredMarketObservation,
): PeerComparisonRow {
  return {
    metric: LABELS[company.metric_key] ?? company.metric_key,
    period: periodKey(company),
    companyValue: formatCompanyValue(company.value ?? "", company.unit),
    peerValue: formatCompanyValue(peer.value ?? "", peer.unit),
    companyEvidence: evidenceReference(company),
    peerEvidence: evidenceReference(peer),
  };
}

function latestCompatibleRows(
  companyId: string,
  peerId: string,
  observations: StoredMarketObservation[],
): PeerComparisonRow[] {
  const companyRows = observations.filter(
    (row) => row.company_id === companyId && eligible(row),
  );
  const peerRows = observations.filter(
    (row) => row.company_id === peerId && eligible(row),
  );
  const byMetric = new Map<string, { sortKey: string; row: PeerComparisonRow }>();

  for (const companyRow of companyRows) {
    const peerRow = peerRows.find((candidate) => compatible(companyRow, candidate));
    if (!peerRow) continue;

    const sortKey = periodSortKey(companyRow);
    const current = byMetric.get(companyRow.metric_key);
    if (!current || sortKey > current.sortKey) {
      byMetric.set(companyRow.metric_key, {
        sortKey,
        row: toRow(companyRow, peerRow),
      });
    }
  }

  return [...byMetric.values()].map(({ row }) => row);
}

export function buildPeerComparisons(
  companyId: string,
  observations: StoredMarketObservation[],
  identities: StoredCompanyIdentity[],
): ComparePeer[] {
  const companyConfig = COMPANY_ROUTE_CONFIGS.find(
    (config) => config.companyId === companyId,
  );
  if (!companyConfig) return [];
  const namesById = new Map(
    identities.map((identity) => [identity.company_id, identity.company_name]),
  );

  return COMPANY_ROUTE_CONFIGS.filter(
    (config) =>
      config.companyId !== companyId &&
      config.sector === companyConfig.sector &&
      namesById.has(config.companyId),
  )
    .map((config) => {
      const comparisonBreakdown = latestCompatibleRows(
        companyId,
        config.companyId,
        observations,
      );
      return {
        ticker: config.ngxSymbol,
        slug: config.slug,
        name: namesById.get(config.companyId) ?? config.companyId,
        sector: config.sector,
        comparableMetrics: comparisonBreakdown.length,
        comparisonBreakdown,
      };
    })
    .filter((peer) => peer.comparableMetrics > 0)
    .sort(
      (left, right) =>
        right.comparableMetrics - left.comparableMetrics ||
        left.name.localeCompare(right.name),
    )
    .slice(0, 3);
}
