import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parseCSV } from "./csv-parser.ts";
import { rowsToRecords } from "./csv-records.ts";
import {
  validateCsvHeaders,
  validateCsvRows,
  validateMetricUnits,
  validateObservationRecords,
} from "./csv-validation.ts";

const csv = readFileSync(
  "data/samples/gtco-financial-observations.csv",
  "utf8",
);
const [headers, ...records] = parseCSV(csv);
const sampleRecords = rowsToRecords(headers, records);

test("accepts the sample CSV header", () => {
  assert.deepEqual(validateCsvHeaders(headers), []);
});
test("reports a missing required header", () => {
  const headersWithoutUnit = headers.filter((header) => header !== "unit");

  assert.deepEqual(validateCsvHeaders(headersWithoutUnit), [
    "Missing required header: unit",
  ]);
});

test("reports a duplicate header", () => {
  assert.deepEqual(validateCsvHeaders([...headers, "unit"]), [
    "Duplicate header: unit",
  ]);
});
test("reports an unexpected header", () => {
  assert.deepEqual(validateCsvHeaders([...headers, "new_field"]), [
    "Unexpected header: new_field",
  ]);
});
test("reports a data record with the wrong number of fields", () => {
  const errors = validateCsvRows([["gtco", "net_income"], ["zenith"]], 2);

  assert.deepEqual(errors, ["CSV data record 2 has 1 field; expected 2."]);
});
test("accepts all sample records with the expected field count", () => {
  assert.deepEqual(validateCsvRows(records, headers.length), []);
});
test("accepts the metric units in the sample CSV", () => {
  assert.deepEqual(validateMetricUnits(sampleRecords), []);
});

test("reports a unit that does not match its metric", () => {
  const changedRecords = sampleRecords.map((record) =>
    record.company_id === "gtco" &&
    record.metric_key === "net_income" &&
    record.target_period === "FY2021"
      ? { ...record, unit: "percent" }
      : record,
  );

  assert.deepEqual(validateMetricUnits(changedRecords), [
    "CSV data record 1: metric 'net_income' expects unit 'NGN', received 'percent'.",
  ]);
});
test("rejects a value on a missing observation", () => {
  const recordWithValue = { ...sampleRecords[0], value: "100" };

  assert.deepEqual(validateObservationRecords([recordWithValue]), [
    "CSV data record 1: status 'missing' must not have a value.",
  ]);
});
test("rejects a value on an unavailable observation", () => {
  const recordWithValue = {
    ...sampleRecords[0],
    status: "unavailable",
    value: "100",
  };

  assert.deepEqual(validateObservationRecords([recordWithValue]), [
    "CSV data record 1: status 'unavailable' must not have a value.",
  ]);
});
test("rejects an available observation without a numeric value", () => {
  const availableRecord = sampleRecords.find(
    (record) => record.status === "available",
  );

  assert.ok(availableRecord, "sample should contain an available observation");

  const recordWithoutValue = { ...availableRecord, value: "" };

  assert.deepEqual(validateObservationRecords([recordWithoutValue]), [
    "CSV data record 1: status 'available' requires a numeric value.",
  ]);
});
test("rejects an available observation without source evidence", () => {
  const availableRecord = sampleRecords.find(
    (record) => record.status === "available",
  );

  assert.ok(availableRecord);

  const recordWithoutEvidence = {
    ...availableRecord,
    capture_method: "",
    source_name: "",
    source_locator: "",
    source_label: "",
  };

  assert.deepEqual(validateObservationRecords([recordWithoutEvidence]), [
    "CSV data record 1: available observation requires capture_method.",
    "CSV data record 1: available observation requires source_name.",
    "CSV data record 1: available observation requires source_locator.",
    "CSV data record 1: available observation requires source_label.",
  ]);
});
test("rejects an unknown observation status", () => {
  const recordWithUnknownStatus = {
    ...sampleRecords[0],
    status: "unknown",
  };

  assert.deepEqual(validateObservationRecords([recordWithUnknownStatus]), [
    "CSV data record 1: invalid status 'unknown'.",
  ]);
});
test("rejects a company ID that is not seeded", () => {
  const availableRecord = sampleRecords.find(
    (record) => record.status === "available",
  );

  assert.ok(availableRecord);

  const recordWithUnknownCompany = {
    ...availableRecord,
    company_id: "unknown_bank",
  };

  assert.deepEqual(validateObservationRecords([recordWithUnknownCompany]), [
    "CSV data record 1: unknown company_id 'unknown_bank'.",
  ]);
});

test("rejects an impossible reporting-period date", () => {
  const availableRecord = sampleRecords.find(
    (record) => record.status === "available",
  );

  assert.ok(availableRecord);

  const recordWithImpossibleDate = {
    ...availableRecord,
    period_start: "2024-02-30",
  };

  assert.deepEqual(validateObservationRecords([recordWithImpossibleDate]), [
    "CSV data record 1: period_start must be a valid YYYY-MM-DD date.",
  ]);
});
