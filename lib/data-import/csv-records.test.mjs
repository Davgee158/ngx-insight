import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parseCSV } from "./csv-parser.ts";
import { rowsToRecords } from "./csv-records.ts";

test("maps sample CSV values to their header names", () => {
  const csv = readFileSync(
    "data/samples/gtco-financial-observations.csv",
    "utf8",
  );
  const [headers, ...rows] = parseCSV(csv);
  const records = rowsToRecords(headers, rows);

  assert.equal(records[0].company_id, "gtco");
  assert.equal(records[0].metric_key, "net_income");
});