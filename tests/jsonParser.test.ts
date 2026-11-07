
import { parseJSON } from "../src/parsers/jsonParser";

describe("JSON Parser Tests", () => {
  test("should parse valid JSON data", () => {
    const json = '[{"name":"Book A","price":20}]';

    expect(parseJSON(json)).toEqual([
      { name: "Book A", price: 20 }
    ]);
  });

  test("should handle empty content", () => {
    expect(parseJSON("")).toEqual([]);
  });

  test("should handle an empty array", () => {
    expect(parseJSON("[]")).toEqual([]);
  });

  test("should reject invalid JSON syntax", () => {
    expect(() => parseJSON("{invalid}")).toThrow();
  });

  test("should reject a non-array JSON value", () => {
    expect(() => parseJSON('{"name":"Book"}')).toThrow(
      "Invalid JSON: Expected an array of objects"
    );
  });

  test("should reject arrays containing non-objects", () => {
    expect(() => parseJSON('[1,2,3]')).toThrow(
      "Invalid JSON: All items must be objects"
    );
  });

  test("should preserve nested objects", () => {
    const json = '[{"book":{"title":"Book A"},"quantity":2}]';

    expect(parseJSON(json)).toEqual([
      {
        book: { title: "Book A" },
        quantity: 2
      }
    ]);
  });
});
