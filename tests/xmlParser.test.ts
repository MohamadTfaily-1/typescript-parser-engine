
import { parseXML } from "../src/parsers/xmlParser";

describe("XML Parser Tests", () => {
  test("should parse valid XML data", () => {
    const xml = `
      <data>
        <row>
          <OrderID>5001</OrderID>
          <Type>Plush Toy</Type>
          <Price>50</Price>
        </row>
      </data>
    `;

    expect(parseXML(xml)).toEqual([
      {
        OrderID: "5001",
        Type: "Plush Toy",
        Price: "50"
      }
    ]);
  });

  test("should parse multiple rows", () => {
    const xml = `
      <data>
        <row><OrderID>1</OrderID></row>
        <row><OrderID>2</OrderID></row>
      </data>
    `;

    expect(parseXML(xml)).toEqual([
      { OrderID: "1" },
      { OrderID: "2" }
    ]);
  });

  test("should handle empty content", () => {
    expect(parseXML("")).toEqual([]);
  });

  test("should handle an empty data element", () => {
    expect(parseXML("<data></data>")).toEqual([]);
  });

  test("should reject invalid XML", () => {
    expect(() => parseXML("<data><row></data>")).toThrow();
  });

  test("should reject missing data element", () => {
    expect(() => parseXML("<orders></orders>")).toThrow(
      "Invalid XML: Missing data element"
    );
  });

  test("should preserve nested elements", () => {
    const xml = `
      <data>
        <row>
          <OrderID>1</OrderID>
          <Details>
            <Color>Red</Color>
          </Details>
        </row>
      </data>
    `;

    expect(parseXML(xml)).toEqual([
      {
        OrderID: "1",
        Details: {
          Color: "Red"
        }
      }
    ]);
  });

  test("should preserve XML attributes", () => {
    const xml = `
      <data>
        <row status="paid">
          <OrderID>1</OrderID>
        </row>
      </data>
    `;

    expect(parseXML(xml)).toEqual([
      {
        OrderID: "1",
        "@_status": "paid"
      }
    ]);
  });
});
