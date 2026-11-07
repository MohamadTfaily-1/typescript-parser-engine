
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";

export type XMLRow = Record<string, unknown>;

export function parseXML(content: string): XMLRow[] {
  if (!content.trim()) {
    return [];
  }

  const validation = XMLValidator.validate(content);

  if (validation !== true) {
    throw new Error(
      `Invalid XML: ${validation.err.msg}`
    );
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true
  });

  const result: unknown = parser.parse(content);

  if (
    typeof result !== "object" ||
    result === null ||
    Array.isArray(result)
  ) {
    throw new Error("Invalid XML: Expected an object");
  }

  const root = result as Record<string, unknown>;
  const data = root.data;
  if (data === "") {
  return [];
}

  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    throw new Error("Invalid XML: Missing data element");
  }

  const rows = (data as Record<string, unknown>).row;

  if (rows === undefined) {
    return [];
  }

  const rowArray = Array.isArray(rows) ? rows : [rows];

  for (const row of rowArray) {
    if (
      typeof row !== "object" ||
      row === null ||
      Array.isArray(row)
    ) {
      throw new Error("Invalid XML: Every row must be an object");
    }
  }

  return rowArray as XMLRow[];
}

export function xmlParser(filePath: string): XMLRow[] {
  const content = readFileSync(filePath, "utf-8");
  return parseXML(content);
}
