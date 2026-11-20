export function parseCSV(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let insideQuotes = false;
  let afterClosingQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (insideQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          insideQuotes = false;
          afterClosingQuote = true;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (afterClosingQuote && char !== "," && char !== "\n" && char !== "\r") {
      throw new Error("Unexpected character after a closing quote.");
    }
    if (char === '"') {
      if (field.length > 0) {
        throw new Error(
          "A quoted field must start at the beginning of a field.",
        );
      }

      insideQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      afterClosingQuote = false;
      continue;
    }
    if (char === "\n" || char === "\r") {
      row.push(field);
      rows.push(row);

      row = [];
      field = "";

      if (char === "\r" && input[i + 1] === "\n") {
        i++;
      }

      continue;
    }
    field += char;
  }
  if (insideQuotes) {
    throw new Error("CSV ended before a quoted field was closed.");
  }

  if (input.length > 0 && !input.endsWith("\n") && !input.endsWith("\r")) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}
