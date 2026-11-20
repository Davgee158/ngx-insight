import { parseCSV } from "./csv-parser.ts";
import { rowsToRecords } from "./csv-records.ts";
import {
  validateCsvHeaders,
  validateCsvRows,
  validateMetricUnits,
  validateObservationRecords,
} from "./csv-validation.ts";
import { normalizeCsvRecord } from "./csv-normalize.ts";
import { createContentFingerprint } from "./content-fingerprint.ts";

type PreparedRecord = ReturnType<typeof normalizeCsvRecord> & {
  content_fingerprint: string;
};
type ImportSummary = {
  totalRows: number;
  preparedRows: number;
  rejectedRows: number;
  skippedRows: number;
};

export function prepareCsvImport(csvText: string): {
  records: PreparedRecord[];
  errors: string[];
  summary: ImportSummary;
} {
  let rows: string[][];

  try {
    rows = parseCSV(csvText);
  } catch (error) {
    return {
      records: [],
      errors: [
        error instanceof Error ? error.message : "CSV could not be parsed.",
      ],
      summary: {
        totalRows: 0,
        preparedRows: 0,
        rejectedRows: 0,
        skippedRows: 0,
      },
    };
  }

  if (rows.length === 0) {
    return {
      records: [],
      errors: ["CSV is empty."],
      summary: {
        totalRows: 0,
        preparedRows: 0,
        rejectedRows: 0,
        skippedRows: 0,
      },
    };
  }

  const [headers, ...dataRows] = rows;

  const structureErrors = [
    ...validateCsvHeaders(headers),
    ...validateCsvRows(dataRows, headers.length),
  ];

  if (structureErrors.length > 0) {
    return {
      records: [],
      errors: structureErrors,
      summary: {
        totalRows: dataRows.length,
        preparedRows: 0,
        rejectedRows: dataRows.length,
        skippedRows: 0,
      },
    };
  }

  const csvRecords = rowsToRecords(headers, dataRows);
  const recordErrors = [
    ...validateMetricUnits(csvRecords),
    ...validateObservationRecords(csvRecords),
  ];

  if (recordErrors.length > 0) {
    return {
      records: [],
      errors: recordErrors,
      summary: {
        totalRows: dataRows.length,
        preparedRows: 0,
        rejectedRows: dataRows.length,
        skippedRows: 0,
      },
    };
  }

  const seenFingerprints = new Set<string>();
  const preparedRecords: PreparedRecord[] = [];
  let skippedRows = 0;

  for (const record of csvRecords) {
    const normalized = normalizeCsvRecord(record);
    const fingerprint = createContentFingerprint(normalized);

    if (seenFingerprints.has(fingerprint)) {
      skippedRows++;
      continue;
    }

    seenFingerprints.add(fingerprint);
    preparedRecords.push({
      ...normalized,
      content_fingerprint: fingerprint,
    });
  }

  return {
    records: preparedRecords,
    errors: [],
    summary: {
      totalRows: dataRows.length,
      preparedRows: preparedRecords.length,
      rejectedRows: 0,
      skippedRows,
    },
  };
}
