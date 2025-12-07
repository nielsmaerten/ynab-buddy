import { beforeAll, describe, expect, it, mock } from "bun:test";
import { runApp } from "./index";
import { BankFile, Configuration, ParsedBankFile } from "./types";

const mock_importPath = Math.random().toString();
const mock_bankFiles: BankFile[] = [
  { isBankFile: true, path: mock_importPath, matchedParser: "TEST" } as any,
];
const mock_parsedFile: ParsedBankFile = {
  source: {
    isBankFile: true,
    matchedParser: "TEST",
    matchedPattern: {
      save_parsed_file: true,
      delete_original_file: false,
    } as any,
    path: mock_importPath,
  },
  transactions: [],
};
const mock_getConfiguration: Configuration = {
  parsers: [],
  bankFilePatterns: [],
  ynab: {
    token: "",
    upload: true,
  },
  importPath: mock_importPath,
  searchSubDirectories: false,
  configurationDone: true,
};
const mocks = {
  parseBankFile: mock(() => mock_parsedFile),
  exportCsv: mock(),
  cleanup: mock(),
  upload: mock(),
  displayWelcomeMessage: mock(),
  displayGoodbyeMessage: mock(),
  exitApp: mock(),
  confirmImportPath: mock(() => mock_importPath),
  findBankFiles: mock(() => mock_bankFiles),
  getConfiguration: mock(() => mock_getConfiguration),
};

describe("index.ts", () => {
  beforeAll(async () => {
    process.env.YNAB_BUDDY_DISABLE_AUTO_RUN = "true";
    await runApp(mocks);
  });

  it("gets configuration object", () => {
    expect(mocks.getConfiguration).toHaveBeenCalled();
  });

  it("shows welcome message", () => {
    const isFirstRun = !mock_getConfiguration.configurationDone;
    expect(mocks.displayWelcomeMessage).toHaveBeenCalledWith(isFirstRun);
  });

  it("asks to confirm import path", () => {
    expect(mocks.confirmImportPath).toHaveBeenCalledWith(mock_importPath);
  });

  it("looks for bank files in import path", () => {
    expect(mocks.findBankFiles).toHaveBeenCalledWith(
      mock_importPath,
      mock_getConfiguration,
    );
  });

  it("attempts to parse every bankFile", () => {
    expect(mocks.parseBankFile).toHaveBeenCalledTimes(mock_bankFiles.length);
  });

  it("exports the resulting CSV files", () => {
    expect(mocks.exportCsv).toHaveBeenCalled();
    expect(mocks.cleanup).toHaveBeenCalled();
  });

  it("uploads transactions to ynab", () => {
    expect(mocks.upload).toHaveBeenCalled();
  });
});
