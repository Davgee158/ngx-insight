export type NormalizedMarketObservation = {
  company_id: string;
  metric_key: string;
  period_kind: string;
  period_start: string | null;
  period_end: string | null;
  observation_date: string | null;
  target_period: string | null;
  comparison_period_start: string | null;
  comparison_period_end: string | null;
  value: number | null;
  unit: string;
  source_value: number | null;
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
  status: string;
  verification_status:
    | "not_assessed"
    | "primary_source_checked"
    | "independently_reconciled";
  published_on: string | null;
  published_at: string | null;
  retrieved_on: string | null;
  retrieved_at: string | null;
};

function nullableText(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? null : trimmed;
}

function nullableNumber(value: string | undefined): number | null {
  const trimmed = value?.trim() ?? "";
  if (trimmed === "") return null;

  const number = Number(trimmed);
  if (!Number.isFinite(number)) {
    throw new Error(`Expected a finite number, received '${trimmed}'.`);
  }

  return number;
}

function normalizedCaptureMethod(
  original: string | null,
): NormalizedMarketObservation["capture_method"] {
  if (original === null) return null;
  if (
    original === "manual_transcription" ||
    original.startsWith("manual_transcription_")
  ) {
    return "manual_transcription";
  }
  if (
    original === "provider_api_response" ||
    original.startsWith("provider_api_response_")
  ) {
    return "provider_api_response";
  }
  return "other";
}

function datePart(timestamp: string | null): string | null {
  return timestamp === null ? null : timestamp.slice(0, 10);
}
function timestampPart(value: string | null): string | null {
  if (value === null) return null;

  // A date alone has no time or timezone, so don't store it as a timestamp.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  return value;
}

function normalizedVerificationStatus(
  value: string | undefined,
): NormalizedMarketObservation["verification_status"] {
  switch (value?.trim()) {
    case "primary_source_checked":
      return "primary_source_checked";
    case "independently_reconciled":
      return "independently_reconciled";
    default:
      return "not_assessed";
  }
}

export function normalizeCsvRecord(
  record: Record<string, string>,
): NormalizedMarketObservation {
  const captureMethodOriginal = nullableText(record.capture_method);
  const publishedAt = nullableText(record.published_at);
  const retrievedAt = nullableText(record.retrieved_at);

  return {
    company_id: record.company_id,
    metric_key: record.metric_key,
    period_kind: record.period_kind,
    period_start: nullableText(record.period_start),
    period_end: nullableText(record.period_end),
    observation_date: nullableText(record.observation_date),
    target_period: nullableText(record.target_period),
    comparison_period_start: nullableText(record.comparison_period_start),
    comparison_period_end: nullableText(record.comparison_period_end),
    value: nullableNumber(record.value),
    unit: record.unit,
    source_value: nullableNumber(record.source_value),
    source_unit: nullableText(record.source_unit),
    source_name: nullableText(record.source_name),
    source_locator: nullableText(record.source_locator),
    source_label: nullableText(record.source_label),
    basis: nullableText(record.basis),
    statement_scope: nullableText(record.statement_scope),
    capture_method: normalizedCaptureMethod(captureMethodOriginal),
    capture_method_original: captureMethodOriginal,
    status: record.status,
    verification_status: normalizedVerificationStatus(record.verification_status),
    published_on: datePart(publishedAt),
    published_at: timestampPart(publishedAt),
    retrieved_on: datePart(retrievedAt),
    retrieved_at: timestampPart(retrievedAt),
  };
}
