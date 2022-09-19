import { ParsedBankFile, Parser, Transaction } from "../types";
import * as fixtures from "./parser.spec.fixtures";

// Patch readFileSync so it produces a different CSV for every test
let csvFixtureBeingTested: number;
let customCsv: string | undefined;
jest.mock("fs", () => {
  return {
    readFileSync: () => {
      return customCsv || fixtures.csv[csvFixtureBeingTested];
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
      outflow_indicator: "Out",
    };
    const result = runParser(csvFixtures.inOutIndicator, parseCfg);
    expect(result.transactions[0].amount).toBeGreaterThan(0);
    expect(result.transactions[1].amount).toBeLessThan(0);
    expect(result.transactions[2].amount).toBeGreaterThan(0);
  });

  it("adds the Payee field", () => {
    const parseCfg = { columns: ["", "date", "outflow", "memo", "payee"] };
    const result = runParser(csvFixtures.payeeField, parseCfg);
    expect(result.transactions).toHaveLength(3);
    result.transactions.forEach((tx) => {
      expect(tx.payee_name).toBeDefined();
      expect(tx.payee_name!.length).toBeGreaterThan(0);
    });
  });

  it("can parse dates surrounded by spaces without exceptions", () => {
    const parseCfg = { columns: ["", "date", "amount", "memo", "memo2"] };
    const result = runParser(csvFixtures.dateSurroundedBySpaces, parseCfg);
    expect(result.transactions).toHaveLength(3);
  });

  /**
   * This tests only uses a single line of CSV instead of a full fixture.
   * The text "AMOUNT" gets replaced with an amount in a number of different formats.
   * Every amount should parse to the same value (1234.56).
   */
  it("parses amounts in different formats", () => {
    const expectedAmount = 1234.56;

    // Create a simple parser for just 2 columns: date and amount
    const { parseBankFile } = require("./parser");
    const parser = { ...fixtures.defaultParser, columns: ["date", "amount"] };

    // CSV text with a number of different amounts and separators
    const customCsvTemplate = "9/27/2020;AMOUNT";
    const testData: string[][] = [
      /* [amount, decimal_separator, thousand_separator] */
      ["1234.56"],
      ["1234,56"],
      ["1234.56", "."],
      ["1234,56", ","],
      ["1234,56 EUR", ","],
      ["1234.56 EUR", "."],
      ["1,234.56", ".", ","],
      ["1.234,56", ",", "."],
      ["$1,234.56", ".", ","],
      ["$1.234,56", ",", "."],
      ["€ 1234.56", "."],
      ["1,234.56 USD", ".", ","],
    ];

    const errors: string[][] = [];
    testData.forEach((amount) => {
      // Set customCSV that will be returned by the mocked readFileSync
      customCsv = customCsvTemplate.replace("AMOUNT", amount[0]);

      // Configure the parser to use separators
      parser.decimal_separator = amount[1] || undefined;
      parser.thousand_separator = amount[2] || undefined;

      // Parse the CSV and compare the result to the expected amount
      const result = parseBankFile(fixtures.bankFile, [parser]);
      const actualAmount = result.transactions[0].amount;
      if (actualAmount !== expectedAmount) errors.push([actualAmount, amount]);
    });

    // Unset customCsv so the mock goes back using parser.spec.fixtures.ts
    customCsv = undefined;
    if (errors.length > 0) {
      throw new Error(
        `Amounts did not parse correctly: ${JSON.stringify(errors)}`
      );
    }
  });

  it("can parse thousand separators in amounts field", () => {
    const parseCfg = {
      columns: ["", "date", "amount", "payee", "memo"],
      thousand_separator: ",",
    };
    const result = runParser(csvFixtures.thousandSeparators, parseCfg);
    expect(result.transactions[0].amount).toEqual(8711.13);
    expect(result.transactions[1].amount).toEqual(9081.31);
    expect(result.transactions[2].amount).toEqual(212.13);
  });

  it("can parse localized separators in amounts field", () => {
    const parseCfg = {
      columns: ["", "date", "amount", "payee", "memo"],
      thousand_separator: ".",
      decimal_separator: ",",
    };
    const result = runParser(
      csvFixtures.dotThousandSeparatorsCommaDecimalSeparator,
      parseCfg
    );
    expect(result.transactions[0].amount).toEqual(8711.13);
    expect(result.transactions[1].amount).toEqual(9081.31);
    expect(result.transactions[2].amount).toEqual(212.13);
  });

  it("inverses amount in outflow column", () => {
    const parseCfg = {
      columns: ["date", "", "", "", "payee", "inflow", "outflow"],
      delimiter: ",",
      header_rows: 1,
    };
    const result = runParser(csvFixtures.inflowOutflowColumns, parseCfg);
    expect(result.transactions[0].amount).toEqual(582.27);
    expect(result.transactions[1].amount).toEqual(-582.27);
  });

  it("passes GitHub issue #45", () => {
    const parseCfg = {
      columns: ["skip", "skip", "date", "payee", "inflow", "inflow", "skip"],
      date_format: "dd/MM/yyyy",
      decimal_separator: ".",
      thousand_separator: "",
      delimiter: ",",
      header_rows: 1,
    };
    const result = runParser(csvFixtures.githubIssue45, parseCfg);
    expect(result.transactions).toHaveLength(3);
    expect(result.transactions[0].amount).toEqual(-7);
    expect(result.transactions[1].amount).toEqual(-180);
    expect(result.transactions[2].amount).toEqual(100);
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
  payeeField = 5,
  dateSurroundedBySpaces = 6,
  thousandSeparators = 7,
  dotThousandSeparatorsCommaDecimalSeparator = 8,
  inflowOutflowColumns = 9,
  githubIssue45 = 10,
}

const validateTransaction = (tx: Transaction) => {
  // See explanation in parser.spec.fixtures
  expect(tx.amount).toBeGreaterThan(-1000);
  expect(tx.amount).toBeLessThan(1000);
  expect(tx.date.getTime()).toBeGreaterThan(new Date("1990-02-27").getTime());
  expect(tx.date.getTime()).toBeLessThan(new Date("2021-09-09").getTime());
};
