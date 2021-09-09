import { ParsedBankFile, Parser, Transaction } from "../types";
import * as fixtures from "./parser.spec.fixtures";

// Patch readFileSync so it produces a different CSV for every test
let csvFixtureBeingTested: number;
jest.mock("fs", () => {
  return {
    readFileSync: () => {
      return fixtures.csv[csvFixtureBeingTested];
    },
  };
});

describe("parser", () => {
  it("accepts custom delimiters", () => {
    const result = runParser(csvFixtures.customDelimiter);
    expect(result.transactions).toHaveLength(3);
    result.transactions.forEach(validateTransaction);
  });

  it("trims headers, footers and empty lines", () => {
    const parseCfg = { footer_rows: 1, header_rows: 1, delimiter: "," };
    const result = runParser(csvFixtures.headerFooterEmptyLines, parseCfg);
    expect(result.transactions).toHaveLength(3);
    result.transactions.forEach(validateTransaction);
  });

  it("accepts decimal commas", () => {
    const result = runParser(csvFixtures.decimalCommas);
    expect(result.transactions).toHaveLength(3);
    result.transactions.forEach(validateTransaction);
  });
});

const runParser = (fixtureId: number, parseCfg?: Partial<Parser>) => {
  const fullParseCfg = { ...fixtures.defaultParser, ...parseCfg };
  csvFixtureBeingTested = fixtureId;
  const { parseBankFile } = require("./parser");
  return parseBankFile(fixtures.bankFile, [fullParseCfg]) as ParsedBankFile;
};

enum csvFixtures {
  // Indexes on the csv fixtures array in parser.spec.fixtures
  customDelimiter = 0,
  headerFooterEmptyLines = 1,
  decimalCommas = 2,
}

const validateTransaction = (tx: Transaction) => {
  // See explanation in parser.spec.fixtures
  expect(tx.amount).toBeGreaterThan(-1000);
  expect(tx.amount).toBeLessThan(1000);
  expect(tx.date.getTime()).toBeGreaterThan(new Date("1990-02-27").getTime());
  expect(tx.date.getTime()).toBeLessThan(new Date("2021-09-09").getTime());
};
