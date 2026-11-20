import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parseCSV } from "./csv-parser.ts";
import { rowsToRecords } from "./csv-records.ts";
import { normalizeCsvRecord } from "./csv-normalize.ts";

const csv = readFileSync(
  "data/samples/gtco-financial-observations.csv",
  "utf8",
);
const [headers, ...rows] = parseCSV(csv);
const records = rowsToRecords(headers, rows);

test("normalizes an available GTCO FY2023 net income observation", () => {
  const record = records.find(
    (item) =>
      item.company_id === "gtco" &&
      item.metric_key === "net_income" &&
      item.target_period === "FY2023",
  );

  assert.ok(record, "sample should contain GTCO FY2023 net income");

  const normalized = normalizeCsvRecord(record);

  assert.equal(normalized.value, 534425317000);
  assert.equal(normalized.observation_date, null);
  assert.equal(normalized.published_at, null);
  assert.equal(normalized.capture_method, "manual_transcription");
  assert.equal(
    normalized.capture_method_original,
    "manual_transcription_from_official_report",
  );
  assert.equal(normalized.verification_status, "not_assessed");
});
test("normalizes a missing observation without inventing values", () => {
  const record = records.find(
    (item) =>
      item.company_id === "gtco" &&
      item.metric_key === "net_income" &&
      item.target_period === "FY2021",
  );

  assert.ok(record, "sample should contain GTCO FY2021 net income");

  const normalized = normalizeCsvRecord(record);

  assert.equal(normalized.value, null);
  assert.equal(normalized.source_name, null);
  assert.equal(normalized.capture_method, null);
  assert.equal(normalized.capture_method_original, null);
  assert.equal(normalized.status, "missing");
  assert.equal(normalized.verification_status, "not_assessed");
});
test("does not invent a retrieval time from a date-only value", () => {
  const availableRecord = records.find(
    (item) => item.status === "available",
  );

  assert.ok(availableRecord);

  const normalized = normalizeCsvRecord({
    ...availableRecord,
    retrieved_at: "2026-10-28",
  });

  assert.equal(normalized.retrieved_on, "2026-10-28");
  assert.equal(normalized.retrieved_at, null);
});