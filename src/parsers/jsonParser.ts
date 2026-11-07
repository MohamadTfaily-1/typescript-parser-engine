
import { readFileSync } from "node:fs";

export type JSONRow = Record<string, unknown>;

export function parseJSON(content: string): JSONRow[] {
  if (!content.trim()) {
    return [];
  }

  const data: unknown = JSON.parse(content.replace(/^\uFEFF/, ""));

  if (!Array.isArray(data)) {
    throw new Error("Invalid JSON: Expected an array of objects");
  }

  for (const item of data) {
    if (
      typeof item !== "object" ||
      item === null ||
      Array.isArray(item)
    ) {
      throw new Error("Invalid JSON: All items must be objects");
    }
  }

  return data as JSONRow[];
}

export function jsonParser(filePath: string): JSONRow[] {
  const content = readFileSync(filePath, "utf-8");
  return parseJSON(content);
}
