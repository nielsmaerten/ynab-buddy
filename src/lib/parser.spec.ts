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

  it("inverts Outflow", () => {
    const cfg_inflow = { columns: ["", "date", "amount", "memo", "payee"] };
    const cfg_outflow = { columns: ["", "date", "outflow", "memo", "payee"] };
    const result_inflow = runParser(csvFixtures.customDelimiter, cfg_inflow);
    const result_outflow = runParser(csvFixtures.customDelimiter, cfg_outflow);

    for (let i = 0; i < result_inflow.transactions.length; i++) {
      const inflow = result_inflow.transactions[i].amount;
      const outflow = result_outflow.transactions[i].amount;
      expect(inflow).toEqual(-outflow);
    }
  });

  it("merges multiple memo columns together", () => {
    const parseCfg = { columns: ["", "date", "amount", "memo", "memo2"] };
    const result = runParser(csvFixtures.multipleMemoColumns, parseCfg);
    expect(result.transactions).toHaveLength(3);
    result.transactions.forEach(validateTransaction);
    result.transactions.forEach((tx) => {
      expect(tx.memo).toEqual("memo A memo B");
    });
  });

  it("pulls credit/debit from a separate column", () => {
    const parseCfg = {
      columns: ["", "date", "amount", "", "in_out_flag"],
      outflow_indicator: "O",
    };
    const result = runParser(csvFixtures.inOutIndicator, parseCfg);
    expect(result.transactions[0].amount).toBeGreaterThan(0);
    expect(result.transactions[1].amount).toBeLessThan(0);
    expect(result.transactions[2].amount).toBeGreaterThan(0);
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
  multipleMemoColumns = 3,
  inOutIndicator = 4,
}

const validateTransaction = (tx: Transaction) => {
  // See explanation in parser.spec.fixtures
  expect(tx.amount).toBeGreaterThan(-1000);
  expect(tx.amount).toBeLessThan(1000);
  expect(tx.date.getTime()).toBeGreaterThan(new Date("1990-02-27").getTime());
  expect(tx.date.getTime()).toBeLessThan(new Date("2021-09-09").getTime());
};
