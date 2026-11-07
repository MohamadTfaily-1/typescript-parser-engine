
import path from "node:path";

import { csvParser } from "./parsers/csvParser";
import { jsonParser } from "./parsers/jsonParser";
import { xmlParser } from "./parsers/xmlParser";

const dataDirectory = path.join(
  __dirname,
  "..",
  "src",
  "data"
);

const cakeOrders = csvParser(
  path.join(dataDirectory, "cake orders.csv")
);

const bookOrders = jsonParser(
  path.join(dataDirectory, "book orders.json")
);

const toyOrders = xmlParser(
  path.join(dataDirectory, "toy orders.xml")
);

console.log("========== CSV PARSER ==========");
console.log("Total cake orders:", cakeOrders.length);
console.log("First cake order:", cakeOrders[0]);

console.log("\n========== JSON PARSER ==========");
console.log("Total book orders:", bookOrders.length);
console.log("First book order:", bookOrders[0]);

console.log("\n========== XML PARSER ==========");
console.log("Total toy orders:", toyOrders.length);
console.log("First toy order:", toyOrders[0]);
