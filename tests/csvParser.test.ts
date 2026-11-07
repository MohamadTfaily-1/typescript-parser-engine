
import { parseCSV } from "../src/parsers/csvParser";

describe("CSV Parser Tests", () => {
  test("should parse valid CSV data", () => {
    const csv = "name,price\nCake,50\nDonut,10";

    expect(parseCSV(csv)).toEqual([
      { name: "Cake", price: "50" },
      { name: "Donut", price: "10" }
    ]);
  });

  test("should handle empty CSV files", () => {
    expect(parseCSV("")).toEqual([]);
  });

  test("should handle quoted commas", () => {
    const csv = 'name,message\nCake,"Happy, Birthday"';

    expect(parseCSV(csv)).toEqual([
      { name: "Cake", message: "Happy, Birthday" }
    ]);
  });

  test("should handle escaped quotes", () => {
    const csv = 'name,message\nCake,"He said ""Hello"""';

    expect(parseCSV(csv)).toEqual([
      { name: "Cake", message: 'He said "Hello"' }
    ]);
  });

  test("should reject unclosed quotations", () => {
    const csv = 'name,price\n"Cake,50';

    expect(() => parseCSV(csv)).toThrow(
      "Invalid CSV: Unclosed quoted field"
    );
  });

  test("should reject rows with missing columns", () => {
    const csv = "name,price\nCake";

    expect(() => parseCSV(csv)).toThrow(
      "Invalid CSV at row 2"
    );
  });
});
