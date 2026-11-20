import { sql } from "../db/client";
import type { NormalizedMarketObservation } from "./csv-normalize.ts";

type PreparedObservation = NormalizedMarketObservation & {
  content_fingerprint: string;
};
export async function createImportBatch(sourceFile: string) {
  const rows = await sql`
    INSERT INTO import_batches (source_file)
    VALUES (${sourceFile})
    RETURNING import_batch_id
  `;
  const batch = rows[0];

  if (!batch) {
    throw new Error("Import batch insert returned no row.");
  }

  return batch.import_batch_id;
}

export async function insertObservation(
  observation: PreparedObservation,
  importBatchId: string | number,
): Promise<"inserted" | "skipped"> {
  const rows = await sql`
    INSERT INTO market_observations (
      company_id,
      import_batch_id,
      metric_key,
      period_kind,
      period_start,
      period_end,
      observation_date,
      target_period,
      comparison_period_start,
      comparison_period_end,
      value,
      unit,
      source_value,
      source_unit,
      source_name,
      source_locator,
      source_label,
      basis,
      statement_scope,
      capture_method,
      capture_method_original,
      status,
      verification_status,
      published_on,
      published_at,
      retrieved_on,
      retrieved_at,
      content_fingerprint
    ) VALUES (
      ${observation.company_id},
      ${importBatchId},
      ${observation.metric_key},
      ${observation.period_kind},
      ${observation.period_start},
      ${observation.period_end},
      ${observation.observation_date},
      ${observation.target_period},
      ${observation.comparison_period_start},
      ${observation.comparison_period_end},
      ${observation.value},
      ${observation.unit},
      ${observation.source_value},
      ${observation.source_unit},
      ${observation.source_name},
      ${observation.source_locator},
      ${observation.source_label},
      ${observation.basis},
      ${observation.statement_scope},
      ${observation.capture_method},
      ${observation.capture_method_original},
      ${observation.status},
      ${observation.verification_status},
      ${observation.published_on},
      ${observation.published_at},
      ${observation.retrieved_on},
      ${observation.retrieved_at},
      ${observation.content_fingerprint}
    )
    ON CONFLICT (content_fingerprint) DO NOTHING
    RETURNING id
  `;

  return rows.length > 0 ? "inserted" : "skipped";
}

export type StoredMarketObservation = {
  id: string;
  company_id: string;
  import_batch_id: string;
  metric_key: string;
  period_kind: string;
  period_start: string | null;
  period_end: string | null;
  observation_date: string | null;
  target_period: string | null;
  comparison_period_start: string | null;
  comparison_period_end: string | null;
  value: string | null;
  unit: string;
  source_value: string | null;
  source_unit: string | null;
  source_name: string | null;
  source_locator: string | null;
  source_label: string | null;
  basis: string | null;
  statement_scope: string | null;
  capture_method:
    | "manual_transcription"
    | "provider_api_response"
    | "other"
    | null;
  capture_method_original: string | null;
  status:
    | "available"
    | "missing"
    | "unavailable"
    | "not_applicable"
    | "conflicting"
    | "stale";
  verification_status:
    | "not_assessed"
    | "primary_source_checked"
    | "independently_reconciled";
  published_on: string | null;
  published_at: string | null;
  retrieved_on: string | null;
  retrieved_at: string | null;
  content_fingerprint: string;
};

export type StoredCompanyIdentity = {
  company_id: string;
  company_name: string;
};

export async function getCompanyIdentity(
  companyId: string,
): Promise<StoredCompanyIdentity | null> {
  const rows = await sql`
    SELECT company_id, company_name
    FROM companies
    WHERE company_id = ${companyId}
    LIMIT 1
  `;

  return (rows[0] as StoredCompanyIdentity | undefined) ?? null;
}

export async function getCompanyIdentities(
  companyIds: string[],
): Promise<StoredCompanyIdentity[]> {
  if (companyIds.length === 0) return [];
  const rows = await sql`
    SELECT company_id, company_name
    FROM companies
    WHERE company_id = ANY(${companyIds}::text[])
  `;
  return rows as StoredCompanyIdentity[];
}

export async function getCompanyObservations(
  companyId: string,
): Promise<StoredMarketObservation[]> {
  const rows = await sql`
    SELECT
      id::text AS id,
      company_id,
      import_batch_id::text AS import_batch_id,
      metric_key,
      period_kind,
      period_start::text AS period_start,
      period_end::text AS period_end,
      observation_date::text AS observation_date,
      target_period,
      comparison_period_start::text AS comparison_period_start,
      comparison_period_end::text AS comparison_period_end,
      value::text AS value,
      unit,
      source_value::text AS source_value,
      source_unit,
      source_name,
      source_locator,
      source_label,
      basis,
      statement_scope,
      capture_method,
      capture_method_original,
      status,
      verification_status,
      published_on::text AS published_on,
      published_at::text AS published_at,
      retrieved_on::text AS retrieved_on,
      retrieved_at::text AS retrieved_at,
      content_fingerprint
    FROM market_observations
    WHERE company_id = ${companyId}
    ORDER BY
      metric_key,
      period_end DESC NULLS LAST,
      observation_date DESC NULLS LAST,
      target_period DESC NULLS LAST
  `;

  return rows as StoredMarketObservation[];
}

export async function getCompanyObservationsForCompanies(
  companyIds: string[],
): Promise<StoredMarketObservation[]> {
  if (companyIds.length === 0) return [];

  const rows = await sql`
    SELECT
      id::text AS id,
      company_id,
      import_batch_id::text AS import_batch_id,
      metric_key,
      period_kind,
      period_start::text AS period_start,
      period_end::text AS period_end,
      observation_date::text AS observation_date,
      target_period,
      comparison_period_start::text AS comparison_period_start,
      comparison_period_end::text AS comparison_period_end,
      value::text AS value,
      unit,
      source_value::text AS source_value,
      source_unit,
      source_name,
      source_locator,
      source_label,
      basis,
      statement_scope,
      capture_method,
      capture_method_original,
      status,
      verification_status,
      published_on::text AS published_on,
      published_at::text AS published_at,
      retrieved_on::text AS retrieved_on,
      retrieved_at::text AS retrieved_at,
      content_fingerprint
    FROM market_observations
    WHERE company_id = ANY(${companyIds}::text[])
      AND metric_key IN (
        'share_price', 'net_income', 'roe', 'roa', 'net_interest_income',
        'non_interest_income', 'operating_income', 'revenue_growth', 'net_income_growth',
        'pe_ratio', 'pb_ratio', 'eps', 'dividend_yield', 'npl_ratio',
        'loan_loss_coverage_ratio', 'cost_to_income_ratio',
        'loans_to_deposits_ratio', 'capital_adequacy_ratio'
      )
    ORDER BY company_id, metric_key, period_end DESC NULLS LAST,
      observation_date DESC NULLS LAST, target_period DESC NULLS LAST
  `;

  return rows as StoredMarketObservation[];
}

export async function getLatestSharePriceObservations(): Promise<
  StoredMarketObservation[]
> {
  const rows = await sql`
    SELECT DISTINCT ON (company_id)
      id::text AS id,
      company_id,
      import_batch_id::text AS import_batch_id,
      metric_key,
      period_kind,
      period_start::text AS period_start,
      period_end::text AS period_end,
      observation_date::text AS observation_date,
      target_period,
      comparison_period_start::text AS comparison_period_start,
      comparison_period_end::text AS comparison_period_end,
      value::text AS value,
      unit,
      source_value::text AS source_value,
      source_unit,
      source_name,
      source_locator,
      source_label,
      basis,
      statement_scope,
      capture_method,
      capture_method_original,
      status,
      verification_status,
      published_on::text AS published_on,
      published_at::text AS published_at,
      retrieved_on::text AS retrieved_on,
      retrieved_at::text AS retrieved_at,
      content_fingerprint
    FROM market_observations
    WHERE metric_key = 'share_price'
      AND unit = 'NGN_per_share'
      AND status = 'available'
      AND value IS NOT NULL
      AND source_name IS NOT NULL
      AND source_locator IS NOT NULL
      AND source_label IS NOT NULL
      AND verification_status <> 'not_assessed'
    ORDER BY
      company_id,
      observation_date DESC NULLS LAST,
      retrieved_at DESC NULLS LAST,
      retrieved_on DESC NULLS LAST,
      id DESC
  `;

  return rows as StoredMarketObservation[];
}

export async function getLatestFinancialPeriods(
  companyIds: string[],
): Promise<Array<{ company_id: string; period_end: string }>> {
  if (companyIds.length === 0) return [];

  const rows = await sql`
    SELECT company_id, MAX(period_end)::text AS period_end
    FROM market_observations
    WHERE company_id = ANY(${companyIds}::text[])
      AND period_kind = 'FY'
      AND period_end IS NOT NULL
      AND metric_key NOT IN ('share_price', 'pe_ratio', 'pb_ratio', 'dividend_yield')
      AND status = 'available'
      AND value IS NOT NULL
      AND source_name IS NOT NULL
      AND source_locator IS NOT NULL
      AND verification_status <> 'not_assessed'
    GROUP BY company_id
  `;

  return rows as Array<{ company_id: string; period_end: string }>;
}
