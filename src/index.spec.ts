import { Configuration } from "./types";

const mock_importPath = Math.random().toString();
const mock_bankFiles = [Math.random().toString()];
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
  parseBankFile: jest.fn(),
  exportCsv: jest.fn(),
  cleanup: jest.fn(),
  upload: jest.fn(),
  displayWelcomeMessage: jest.fn(),
  displayGoodbyeMessage: jest.fn(),
  confirmImportPath: jest.fn().mockReturnValue(mock_importPath),
  findBankFiles: jest.fn().mockReturnValue(mock_bankFiles),
  getConfiguration: jest.fn().mockReturnValue(mock_getConfiguration),
};

describe("index.ts", () => {
  beforeAll(() => {
    jest.mock("./lib/configuration", () => {
      return {
        getConfiguration: mocks.getConfiguration,
      };
    });
    jest.mock("./lib/cli", () => {
      return {
        confirmImportPath: mocks.confirmImportPath,
        displayWelcomeMessage: mocks.displayWelcomeMessage,
        displayGoodbyeMessage: mocks.displayGoodbyeMessage,
      };
    });
    jest.mock("./lib/filesystem", () => {
      return {
        findBankFiles: mocks.findBankFiles,
        exportCsv: mocks.exportCsv,
        cleanup: mocks.cleanup,
      };
    });
    jest.mock("./lib/parser", () => {
      return {
        parseBankFile: mocks.parseBankFile,
      };
    });
    jest.mock("./lib/uploader", () => {
      return {
        upload: mocks.upload,
      };
    });
    require("./index");
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
      mock_getConfiguration
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
