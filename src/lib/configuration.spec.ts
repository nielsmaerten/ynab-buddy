import { Configuration } from "../types";
import * as fixture from "./configuration.spec.fixture";

describe("configuration", () => {
  let configFileExists = true;
  beforeAll(() => {
    jest.mock("../constants", () => {
      return fixture.constants;
    });
    jest.mock("fs", () => {
      return {
        existsSync: jest.fn().mockImplementation(() => configFileExists),
        readFileSync: jest.fn().mockImplementation(() => fixture.configFile),
        writeFileSync: jest.fn(),
        mkdirSync: jest.fn(),
      };
    });
  });

  it("checks if config file exists", () => {
    configFileExists = true;

    const module = require("./configuration");
    module.getConfiguration();

    const mockedExists: jest.Mock = require("fs").existsSync;
    expect(mockedExists).toHaveBeenCalled();

    const checkedConfPath: string = mockedExists.mock.calls[0][0];
    const expectedConfPath = fixture.constants.CONFIG_FILE;
    expect(checkedConfPath.endsWith(expectedConfPath)).toBeTruthy();
  });

  it("writes example config if no config file exists", () => {
    configFileExists = false;

    const module = require("./configuration");
    module.getConfiguration();

    const mockedWriteFile: jest.Mock = require("fs").writeFileSync;
    expect(mockedWriteFile).toHaveBeenCalled();

    const writeCall1 = mockedWriteFile.mock.calls[0];
    const [writeArg1, writeArg2]: string[] = writeCall1;

    expect(writeArg1.endsWith(fixture.constants.CONFIG_FILE)).toBeTruthy();
    expect(writeArg2).toEqual(fixture.configFile);
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
      skipPathConfirmation: false,
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
      searchSubDirectories: true,
      importPath: "c:/users/test/downloads",
      ynab: {
        token: "ABC12345",
        upload: false,
      },
      stats: undefined,
    };
    expect(actual).toMatchObject(expected);
    expect(expected).toMatchObject(actual);
  });
});
