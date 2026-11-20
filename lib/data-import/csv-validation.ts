export function validateCsvHeaders(headers: string[]): string[] {
  // Return an empty array when valid; otherwise return clear error messages.
  const EXPECTED_HEADERS = [
    "company_id",
    "metric_key",
    "period_kind",
    "period_start",
    "period_end",
    "value",
    "unit",
    "source_name",
    "source_locator",
    "source_label",
    "source_value",
    "source_unit",
    "basis",
    "capture_method",
    "retrieved_at",
    "status",
    "target_period",
    "observation_date",
    "statement_scope",
    "published_at",
    "comparison_period_start",
    "comparison_period_end",
  ];
  const OPTIONAL_HEADERS = ["verification_status"];

  const missingHeaders = EXPECTED_HEADERS.filter(
    (header) => !headers.includes(header),
  );
  const unexpectedHeaders = [
    ...new Set(
      headers.filter(
        (header) =>
          !EXPECTED_HEADERS.includes(header) &&
          !OPTIONAL_HEADERS.includes(header),
      ),
    ),
  ];

  const duplicateHeaders = [
    ...new Set(
      headers.filter((header, index) => headers.indexOf(header) !== index),
    ),
  ];

  return [
    ...missingHeaders.map((header) => `Missing required header: ${header}`),
    ...duplicateHeaders.map((header) => `Duplicate header: ${header}`),
    ...unexpectedHeaders.map((header) => `Unexpected header: ${header}`),
  ];
}
export function validateCsvRows(
  rows: string[][],
  expectedFieldCount: number,
): string[] {
  // Return an empty array when all records have the expected field count.
  const errors: string[] = [];

  rows.forEach((row, index) => {
    if (row.length !== expectedFieldCount) {
      const fieldWord = row.length === 1 ? "field" : "fields";

      errors.push(
        `CSV data record ${index + 1} has ${row.length} ${fieldWord}; expected ${expectedFieldCount}.`,
      );
    }
  });

  return errors;
}
const METRIC_UNITS: Record<string, string> = {
  net_income: "NGN",
  net_interest_income: "NGN",
  non_interest_income: "NGN",
  total_assets: "NGN",
  customer_deposits: "NGN",
  gross_loans: "NGN",
  operating_income: "NGN",

  roe: "percent",
  roa: "percent",
  revenue_growth: "percent",
  net_income_growth: "percent",
  dividend_yield: "percent",
  npl_ratio: "percent",
  loan_loss_coverage_ratio: "percent",
  cost_to_income_ratio: "percent",
  loans_to_deposits_ratio: "percent",
  capital_adequacy_ratio: "percent",

  pe_ratio: "multiple",
  pb_ratio: "multiple",
  share_price: "NGN_per_share",
  eps: "NGN_per_share",
};

const ALLOWED_STATUSES: string[] = [
  "available",
  "missing",
  "unavailable",
  "not_applicable",
  "conflicting",
  "stale",
];
const ALLOWED_VERIFICATION_STATUSES: string[] = [
  "not_assessed",
  "primary_source_checked",
  "independently_reconciled",
];
export function validateMetricUnits(
  records: Record<string, string>[],
): string[] {
  const errors: string[] = [];

  records.forEach((record, index) => {
    const expectedUnit = METRIC_UNITS[record.metric_key];

    if (!expectedUnit) {
      errors.push(
        `CSV data record ${index + 1}: unknown metric '${record.metric_key}'.`,
      );
    } else if (record.unit !== expectedUnit) {
      errors.push(
        `CSV data record ${index + 1}: metric '${record.metric_key}' expects unit '${expectedUnit}', received '${record.unit}'.`,
      );
    }
  });

  return errors;
}
// Approved Day 3 universe. Replace this temporary allowlist with a database lookup
// when importer validation is connected to the companies table.
const APPROVED_COMPANY_IDS = new Set([
  "access_holdings",
  "ecobank_transnational",
  "fcmb_group",
  "fidelity_bank",
  "first_holdco",
  "gtco",
  "jaiz_bank",
  "stanbic_ibtc_holdings",
  "sterling_financial_holdings",
  "uba",
  "unity_bank",
  "wema_bank",
  "zenith_bank",
  "abbey_bank",
  "infinity_trust_mortgage_bank",
  "livingtrust_mortgage_bank",
]);

const CSV_DATE_FIELDS = [
  "period_start",
  "period_end",
  "observation_date",
  "comparison_period_start",
  "comparison_period_end",
];

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}
export function validateObservationRecords(
  records: Record<string, string>[],
): string[] {
  const errors: string[] = [];

  records.forEach((record, index) => {
    if (!APPROVED_COMPANY_IDS.has(record.company_id)) {
      errors.push(
        `CSV data record ${index + 1}: unknown company_id '${record.company_id}'.`,
      );
    }

    CSV_DATE_FIELDS.forEach((field) => {
      const value = record[field]?.trim();

      if (value && !isValidDateOnly(value)) {
        errors.push(
          `CSV data record ${index + 1}: ${field} must be a valid YYYY-MM-DD date.`,
        );
      }
    });
    if (!ALLOWED_STATUSES.includes(record.status)) {
      errors.push(
        `CSV data record ${index + 1}: invalid status '${record.status}'.`,
      );
    }
    const verificationStatus =
      record.verification_status?.trim() || "not_assessed";
    if (!ALLOWED_VERIFICATION_STATUSES.includes(verificationStatus)) {
      errors.push(
        `CSV data record ${index + 1}: invalid verification_status '${verificationStatus}'.`,
      );
    }
    if (
      (record.status === "missing" || record.status === "unavailable") &&
      record.value.trim() !== ""
    ) {
      errors.push(
        `CSV data record ${index + 1}: status '${record.status}' must not have a value.`,
      );
    } else if (
      record.status === "available" &&
      (record.value.trim() === "" || !Number.isFinite(Number(record.value)))
    ) {
      errors.push(
        `CSV data record ${index + 1}: status 'available' requires a numeric value.`,
      );
    }
    if (record.status === "available") {
      const requiredFields = [
        "capture_method",
        "source_name",
        "source_locator",
        "source_label",
      ];

      requiredFields.forEach((field) => {
        if (record[field].trim() === "") {
          errors.push(
            `CSV data record ${index + 1}: available observation requires ${field}.`,
          );
        }
      });
    }
    if (verificationStatus === "primary_source_checked") {
      if (record.status !== "available") {
        errors.push(
          `CSV data record ${index + 1}: primary_source_checked requires status 'available'.`,
        );
      }

      const sourceEvidenceFields = [
        "source_value",
        "source_unit",
        "period_start",
        "period_end",
        "statement_scope",
      ];

      sourceEvidenceFields.forEach((field) => {
        if (record[field]?.trim() === "") {
          errors.push(
            `CSV data record ${index + 1}: primary_source_checked requires ${field}.`,
          );
        }
      });

      if (
        record.source_value?.trim() &&
        !Number.isFinite(Number(record.source_value))
      ) {
        errors.push(
          `CSV data record ${index + 1}: primary_source_checked requires a numeric source_value.`,
        );
      }
    }
  });

  return errors;
}
