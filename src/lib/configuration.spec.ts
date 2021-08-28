/**
 * // TODO
 * Reads configuration from the default config file.
 * If the file does not exist yet, it is created.
 * After configuring the user should remove the 'showConfigPrompt' line
 * from the config file. If the line is still there and says 'true',
 * initializationDone should be false
 */
describe("configuration.ts", () => {
  beforeAll(() => {
    jest.mock("fs", () => {
      return {
        readFileSync: jest.fn().mockReturnValue("test"),
        copyFileSync: jest.fn(),
      };
    });
    jest.mock("../constants.ts", () => {
      return { CONFIG_PATH: "test/config/path" };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("attempts to find the config file", () => {
    const fs = require("fs");
    fs.existsSync = jest.fn();

    require("./configuration").getConfiguration();
    expect(fs.existsSync).toHaveBeenCalled();
  });

  it("attempts to write the default config file if none exists yet", () => {
    const getConfiguration = require("./configuration").getConfiguration;
    const fs = require("fs");

    fs.copyFileSync = jest.fn();
    fs.existsSync = jest.fn().mockReturnValue(false);
    getConfiguration();
    expect(fs.copyFileSync).toHaveBeenCalled();

    fs.copyFileSync = jest.fn();
    fs.existsSync = jest.fn().mockReturnValue(true);
    getConfiguration();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
  });

  it("parses the config file", () => {
    throw "todo";
  });
});
