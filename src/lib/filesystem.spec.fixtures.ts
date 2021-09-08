import { BankFilePattern } from "../types";

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

// Full BankFilePatterns
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
