import { prepareCsvImport } from "./csv-import-preview.ts";
import {
  createImportBatch,
  insertObservation,
} from "./observation-repository.ts";

export type CsvImportResult = {
  batchId: string | number | null;
  totalRows: number;
  insertedRows: number;
  skippedRows: number;
  rejectedRows: number;
  errors: string[];
};

export default async function importCsvText(
  csvText: string,
  sourceFile: string,
): Promise<CsvImportResult> {
  const preview = prepareCsvImport(csvText);

  if (preview.errors.length > 0) {
    return {
      batchId: null,
      totalRows: preview.summary.totalRows,
      insertedRows: 0,
      skippedRows: preview.summary.skippedRows,
      rejectedRows: preview.summary.rejectedRows,
      errors: preview.errors,
    };
  }

  const batchId = await createImportBatch(sourceFile);
  let insertedRows = 0;
  let skippedRows = preview.summary.skippedRows;
  let rejectedRows = 0;
  const errors: string[] = [];

  for (const observation of preview.records) {
    try {
      const result = await insertObservation(observation, batchId);

      if (result === "inserted") {
        insertedRows++;
      } else {
        skippedRows++;
      }
    } catch (error) {
      rejectedRows++;
      const reason =
        error instanceof Error ? error.message : "Unknown database error.";

      errors.push(
        `Could not save ${observation.company_id} ${observation.metric_key} ${observation.target_period ?? ""}: ${reason}`.trim(),
      );
    }
  }

  return {
    batchId,
    totalRows: preview.summary.totalRows,
    insertedRows,
    skippedRows,
    rejectedRows,
    errors,
  };
}
