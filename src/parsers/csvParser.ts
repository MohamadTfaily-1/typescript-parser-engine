
import { readFileSync } from "node:fs";

export type CSVRow = Record<string, string>;

export function parseCSV(content: string): CSVRow[] {
  if (!content.trim()) {
    return [];
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '"') {
      if (insideQuotes && content[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && content[i + 1] === "\n") {
        i++;
      }

      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (insideQuotes) {
    throw new Error("Invalid CSV: Unclosed quoted field");
  }

  if (row.length > 0 || value !== "") {
    row.push(value);
    rows.push(row);
  }

  const nonEmptyRows = rows.filter(
    (currentRow) => currentRow.some((field) => field.trim() !== "")
  );

  if (nonEmptyRows.length === 0) {
    return [];
  }

  const [headers, ...dataRows] = nonEmptyRows;

  if (headers.some((header) => header.trim() === "")) {
    throw new Error("Invalid CSV: Empty column header");
  }

  return dataRows.map((fields, index) => {
    if (fields.length !== headers.length) {
      throw new Error(
        `Invalid CSV at row ${index + 2}: Expected ${headers.length} columns, received ${fields.length}`
      );
    }

    const result: CSVRow = {};

    headers.forEach((header, columnIndex) => {
      Object.defineProperty(result, header, {
        value: fields[columnIndex],
        enumerable: true,
        writable: true,
        configurable: true
      });
    });

    return result;
  });
}

export function csvParser(filePath: string): CSVRow[] {
  const content = readFileSync(filePath, "utf-8");
  return parseCSV(content.replace(/^\uFEFF/, ""));
}
