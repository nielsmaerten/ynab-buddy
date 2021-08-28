import { Configuration } from "./types";

const mock_importPath = "import/path/test";
const mocks = {
  getConfiguration: jest.fn().mockReturnValue({
    importPath: mock_importPath
  } as Configuration),
  confirmImportPath: jest.fn().mockReturnValue(mock_importPath),
  findBankFiles: jest.fn(),
};

describe("index.ts", () => {
  beforeAll(() => {
    jest.mock("./lib/configuration", () => {
      return {
        getConfiguration: mocks.getConfiguration
      };
    });
    jest.mock("./lib/cli", () => {
      return {
        confirmImportPath: mocks.confirmImportPath
      };
    });
    jest.mock("./lib/filesystem", () => {
      return {
        findBankFiles: mocks.findBankFiles
      }
    })
    require("./index");
  });

  it("gets configuration object", () => {
    expect(mocks.getConfiguration).toHaveBeenCalled();
  });

  it("asks to confirm import path", () => {
    expect(mocks.confirmImportPath).toHaveBeenCalledWith(mock_importPath);
  });

  it("looks for bank files in import path", () => {
    expect(mocks.findBankFiles).toHaveBeenCalledWith(mock_importPath)
  });
});
