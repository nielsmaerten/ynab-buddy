import { ParsedBankFile } from "../types";
import fixtures from "./parser.spec.fixtures";

jest.mock("fs", () => {
  return {
    readFileSync: jest.fn().mockReturnValue(fixtures.csv),
  };
});

describe("parser", () => {
  const {parseBankFile} = require("./parser");
  it("extracts transactions from a file", () => {
    const result: ParsedBankFile = parseBankFile(fixtures.bankFile, fixtures.parsers);
    debugger;
  });
});

