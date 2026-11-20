import assert from "node:assert/strict";
import test from "node:test";
import { createContentFingerprint } from "./content-fingerprint.ts";

const observation = {
  company_id: "gtco",
  metric_key: "net_income",
  period_kind: "FY",
  period_start: "2023-01-01",
  period_end: "2023-12-31",
  observation_date: null,
  target_period: "FY2023",
  comparison_period_start: null,
  comparison_period_end: null,
  value: 534425317000,
  unit: "NGN",
  source_value: 534425317,
  source_unit: "NGN_thousands",
  source_name: "GTCO audited FY2024 financial statements",
  source_locator: "report.pdf; page 69",
  source_label: "Profit attributable to equity holders of the parent entity",
  basis: "Consolidated Group; audited IFRS",
  statement_scope: "consolidated_group",
  capture_method_original: "manual_transcription_from_official_report",
  published_at: null,

  // These may change without changing the underlying evidence.
  status: "available",
  verification_status: "not_assessed",
  import_batch_id: 1,
  id: 10,
  retrieved_at: "2026-10-28",
  retrieved_on: "2026-10-28",
};

test("identical evidence produces the same 64-character fingerprint", () => {
  const first = createContentFingerprint(observation);
  const second = createContentFingerprint({ ...observation });

  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
});

test("status, verification, batch, ID, and retrieval changes do not change it", () => {
  const changedMetadata = {
    ...observation,
    status: "stale",
    verification_status: "primary_source_checked",
    import_batch_id: 2,
    id: 99,
    retrieved_at: "2026-11-01",
    retrieved_on: "2026-11-01",
  };

  assert.equal(
    createContentFingerprint(observation),
    createContentFingerprint(changedMetadata),
  );
});

test("changing the value or source label changes the fingerprint", () => {
  assert.notEqual(
    createContentFingerprint(observation),
    createContentFingerprint({ ...observation, value: 534425318000 }),
  );

  assert.notEqual(
    createContentFingerprint(observation),
    createContentFingerprint({
      ...observation,
      source_label: "A different reported line",
    }),
  );
});