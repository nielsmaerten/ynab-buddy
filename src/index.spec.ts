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
  initializationDone: true,
};
const mocks = {
  parseBankFile: jest.fn(),
  displayWelcomeMessage: jest.fn(),
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
      };
    });
    jest.mock("./lib/filesystem", () => {
      return {
        findBankFiles: mocks.findBankFiles,
      };
    });
    jest.mock("./lib/parser", () => {
      return {
        parseBankFile: mocks.parseBankFile,
      };
    });
    require("./index");
  });

  it("gets configuration object", () => {
    expect(mocks.getConfiguration).toHaveBeenCalled();
  });

  it("shows welcome message", () => {
    expect(mocks.displayWelcomeMessage).toHaveBeenCalledWith({isFirstRun: false});
  });

  it("asks to confirm import path", () => {
    expect(mocks.confirmImportPath).toHaveBeenCalledWith(mock_importPath);
  });

  it("looks for bank files in import path", () => {
    expect(mocks.findBankFiles).toHaveBeenCalledWith(mock_importPath);
  });

  it("attempts to parse every bankFile", () => {
    expect(mocks.parseBankFile).toHaveBeenCalledTimes(mock_bankFiles.length);
  });
});
