import { createHash } from "node:crypto";

const CONTENT_FIELDS = [
  "company_id",
  "metric_key",
  "period_kind",
  "period_start",
  "period_end",
  "observation_date",
  "target_period",
  "comparison_period_start",
  "comparison_period_end",
  "value",
  "unit",
  "source_value",
  "source_unit",
  "source_name",
  "source_locator",
  "source_label",
  "basis",
  "statement_scope",
  "capture_method_original",
  "published_at",
] as const;

export function createContentFingerprint(
  observation: Record<string, unknown>,
): string {
  const content = CONTENT_FIELDS.map(
    (field) => observation[field] ?? null,
  );
  const canonicalJson = JSON.stringify(content);

  return createHash("sha256").update(canonicalJson).digest("hex");
}