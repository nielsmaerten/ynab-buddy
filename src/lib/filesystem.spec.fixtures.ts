import { BankFilePattern, Configuration, ParsedBankFile } from "../types";

// (Fake) paths to test files that will have to be matched to a pattern
export const testFiles = {
  notBankFile: "/home/test/downloads/not-a-banks-file.txt",
  bankFile: "/home/test/downloads/myBank-export-checking-435423432.csv",
  nestedBankFile: "/home/test/downloads/otherBank/savings/export.csv",
};

// Base object for all BankFilePatterns we'll use for testing
const baseTestPattern: Partial<BankFilePattern> = {
  upload: false,
  ynab_budget_id: "",
  ynab_account_id: "",
  ynab_flag_color: "",
  save_parsed_file: true,
  delete_original_file: true,
};

// Unit test BankFilePatterns
export const testBankFilePatterns = [
  {
    ...baseTestPattern,
    account_name: "Checking Account",
    parser: "my-bank",
    pattern: "myBank-export-checking-*.csv",
  },
  {
    ...baseTestPattern,
    account_name: "Other Savings Account",
    parser: "otherBank",
    pattern: "savings/export.CSV",
  },
] as BankFilePattern[];

// Live test BankFilePatterns
export const liveBankFilePatterns = [
  {
    ...baseTestPattern,
    account_name: "Bank A Savings",
    parser: "bankA",
    pattern: "bankA_*_savings.csv",
  },
  {
    ...baseTestPattern,
    account_name: "Bank A Checking",
    parser: "bankA",
    pattern: "bankA_*_checking.csv",
  },
  {
    ...baseTestPattern,
    account_name: "Bank B Checking",
    parser: "bankB",
    pattern: "bankB-CHECKING.csv",
  },
  {
    ...baseTestPattern,
    account_name: "Bank C Savings",
    parser: "bankC",
    pattern: "savings/export.csv",
  },
  {
    ...baseTestPattern,
    account_name: "Bank C Checking",
    parser: "bankC",
    pattern: "checking/export.csv",
  },
] as BankFilePattern[];

// Live tests config
export const liveConfig: Configuration = {
  bankFilePatterns: liveBankFilePatterns,
  configurationDone: true,
  parsers: [],
  searchSubDirectories: true,
  ynab: {
    token: "",
    upload: false,
  },
  importPath: "",
};

export const parsedBankFileFixture: ParsedBankFile = {
  source: {
    isBankFile: true,
    path: "/not/a/real/file.csv",
    matchedPattern: {
      delete_original_file: true,
      save_parsed_file: true,
    } as any,
    matchedParser: "TEST",
  },
  transactions: [
    {
      amount: 420.69,
      date: new Date("1990-02-27"),
      memo: "TEST MEMO",
    },
  ],
};
