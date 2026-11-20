export function rowsToRecords(
  headers: string[],
  rows: string[][],
): Record<string, string>[] {
  // Convert each row into an object using its header names.
  return rows.map((row) => {
    const record: Record<string, string> = {};

    headers.forEach((header, index) => {
      record[header] = row[index];
    });

    return record;
  });
}
