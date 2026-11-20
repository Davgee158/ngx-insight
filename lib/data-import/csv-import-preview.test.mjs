import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { prepareCsvImport } from "./csv-import-preview.ts";

const csv = readFileSync(
  "data/samples/gtco-financial-observations.csv",
  "utf8",
);

test("prepares all sample observations with fingerprints", () => {
  const result = prepareCsvImport(csv);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.summary, {
    totalRows: 78,
    preparedRows: 78,
    skippedRows: 0,
    rejectedRows: 0,
  });
  assert.equal(result.records.length, 78);

  assert.ok(
    result.records.every((record) =>
      /^[0-9a-f]{64}$/.test(record.content_fingerprint),
    ),
    "every prepared record should have a SHA-256 fingerprint",
  );
});
test("rejects the sample when a row has the wrong metric unit", () => {
  const invalidCsv = csv.replace(
    "gtco,net_income,FY,,,,NGN",
    "gtco,net_income,FY,,,,percent",
  );

  assert.notEqual(invalidCsv, csv, "test should change the first data row");

  const result = prepareCsvImport(invalidCsv);

  assert.deepEqual(result.records, []);
  assert.deepEqual(result.summary, {
    totalRows: 78,
    preparedRows: 0,
    skippedRows: 0,
    rejectedRows: 78,
  });

  assert.ok(
    result.errors.includes(
      "CSV data record 1: metric 'net_income' expects unit 'NGN', received 'percent'.",
    ),
  );
});
test("skips a repeated observation within the same CSV", () => {
  const lines = csv.trimEnd().split(/\r?\n/);
  const firstDataRow = lines[1];
  const csvWithDuplicate = `${csv.trimEnd()}\n${firstDataRow}\n`;

  const result = prepareCsvImport(csvWithDuplicate);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.summary, {
    totalRows: 79,
    preparedRows: 78,
    skippedRows: 1,
    rejectedRows: 0,
  });
  assert.equal(result.records.length, 78);
  assert.equal(
    new Set(result.records.map((record) => record.content_fingerprint)).size,
    78,
    "prepared records should have unique fingerprints",
  );
});
test("prepared records match the database observation columns", () => {
  const result = prepareCsvImport(csv);
  const record = result.records[0];

assert.ok(record, "preview should contain a prepared record");

  assert.ok(record, "sample should contain GTCO FY2023 net income");

  const expectedColumns = [
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
    "capture_method",
    "capture_method_original",
    "status",
    "verification_status",
    "published_on",
    "published_at",
    "retrieved_on",
    "retrieved_at",
    "content_fingerprint",
  ];

  assert.deepEqual(Object.keys(record).sort(), expectedColumns.sort());
});
