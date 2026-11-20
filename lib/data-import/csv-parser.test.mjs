import assert from "node:assert/strict";
import test from "node:test";
import { parseCSV } from "./csv-parser.ts";
import { readFileSync } from "node:fs";

test("parses plain fields", () => {
  const result = parseCSV("gtco,net_income");

  assert.deepEqual(result, [["gtco", "net_income"]]);
});
test("preserves an empty field", () => {
  const result = parseCSV("gtco,,FY2024");

  assert.deepEqual(result, [["gtco", "", "FY2024"]]);
});
test("keeps a quoted comma inside its field", () => {
  const result = parseCSV('"GTCO, Plc",GTCO');

  assert.deepEqual(result, [["GTCO, Plc", "GTCO"]]);
});
test("converts doubled quotes inside a quoted field to one quote", () => {
  const result = parseCSV('"say ""hello""",GTCO');

  assert.deepEqual(result, [['say "hello"', "GTCO"]]);
});
test("parses Windows CRLF row endings", () => {
  const result = parseCSV("alpha,beta\r\ngamma,delta");

  assert.deepEqual(result, [
    ["alpha", "beta"],
    ["gamma", "delta"],
  ]);
});
test("rejects an unclosed quoted field", () => {
  assert.throws(
    () => parseCSV('"unfinished'),
    /CSV ended before a quoted field was closed/,
  );
});
test("rejects a quote inside an unquoted field", () => {
  assert.throws(() => parseCSV('ab"cd"'));
});
test("rejects text after a closing quote", () => {
  assert.throws(() => parseCSV('"GTCO"x'));
});
test("parses the sample CSV with consistent columns", () => {
  const csv = readFileSync(
    "data/samples/gtco-financial-observations.csv",
    "utf8",
  );
  const rows = parseCSV(csv);
  const [header, ...observations] = rows;

  assert.equal(observations.length, 78);

  observations.forEach((observation, index) => {
    assert.equal(
      observation.length,
      header.length,
      `CSV record ${index + 1} has the wrong number of columns`,
    );
  });
});
