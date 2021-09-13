import { readFileSync } from "fs";
import { CONFIG_FILE_EXAMPLE } from "../constants";
import { Configuration } from "../types";

describe("configuration.ts", () => {
  beforeAll(() => {
    const configFixture = getExampleConfig();
    // FIXME: Mocking is not done correctly in these tests
    jest.mock("fs", () => {
      return {
        readFileSync: jest.fn().mockReturnValue(configFixture),
        copyFileSync: jest.fn(),
        mkdirSync: jest.fn(),
      };
    });
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
    const actual: Configuration = require("./configuration").getConfiguration();
    const expected: Configuration = {
      bankFilePatterns: [
        {
          account_name: "BNP Checking Account",
          ynab_account_id: "00000000-0000-0000-0000-000000000000",
          ynab_budget_id: "00000000-0000-0000-0000-000000000000",
          ynab_flag_color: "purple",
          parser: "bnp-example-parser",
          delete_original_file: true,
          save_parsed_file: false,
          upload: true,
          pattern: "BNP-export-IBAN01233456789-*.csv",
        },
      ],
      configurationDone: false,
      parsers: [
        {
          columns: ["skip", "skip", "memo", "date", "inflow", "skip"],
          date_format: "M/d/yyyy",
          delimiter: ",",
          footer_rows: 0,
          header_rows: 2,
          name: "bnp-example-parser",
        },
      ],
      searchSubDirectories: false,
      importPath: "c:/users/test/downloads",
      ynab: {
        token: "ABC12345",
        upload: false,
      },
    };
    expect(actual).toMatchObject(expected);
    expect(expected).toMatchObject(actual);
  });
});

const getExampleConfig = () => {
  return readFileSync(CONFIG_FILE_EXAMPLE).toString();
};
