import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
} from "bun:test";
import type { Mock } from "bun:test";
import { Configuration } from "../types";
import * as fixture from "./configuration.spec.fixture";

mock.restore();

describe("configuration", () => {
  let configFileExists = true;
  const fs = require("fs");
  const existsSyncOriginal = fs.existsSync;
  const readFileSyncOriginal = fs.readFileSync;
  const writeFileSyncOriginal = fs.writeFileSync;
  const mkdirSyncOriginal = fs.mkdirSync;
  const existsSyncMock = mock(() => configFileExists);
  const readFileSyncMock = mock(() => fixture.configFile);
  const writeFileSyncMock = mock();
  const mkdirSyncMock = mock();

  beforeAll(() => {
    mock.module("../constants", () => {
      return fixture.constants;
    });
    fs.existsSync = existsSyncMock;
    fs.readFileSync = readFileSyncMock;
    fs.writeFileSync = writeFileSyncMock;
    fs.mkdirSync = mkdirSyncMock;
  });

  afterAll(() => {
    fs.existsSync = existsSyncOriginal;
    fs.readFileSync = readFileSyncOriginal;
    fs.writeFileSync = writeFileSyncOriginal;
    fs.mkdirSync = mkdirSyncOriginal;
    mock.restore();
  });

  beforeEach(() => {
    existsSyncMock.mockClear();
    readFileSyncMock.mockClear();
    writeFileSyncMock.mockClear();
    mkdirSyncMock.mockClear();
  });

  it("checks if config file exists", () => {
    configFileExists = true;

    delete require.cache[require.resolve("./configuration")];
    const module = require("./configuration");
    module.getConfiguration();

    const mockedExists: Mock = existsSyncMock;
    expect(mockedExists).toHaveBeenCalled();

    const checkedConfPath: string = mockedExists.mock.calls[0][0];
    const expectedConfPath = fixture.constants.CONFIG_FILE;
    expect(checkedConfPath.endsWith(expectedConfPath)).toBeTruthy();
  });

  it("writes example config if no config file exists", () => {
    configFileExists = false;

    delete require.cache[require.resolve("./configuration")];
    const module = require("./configuration");
    module.getConfiguration();

    const mockedWriteFile: Mock = writeFileSyncMock;
    expect(mockedWriteFile).toHaveBeenCalled();

    const writeCall1 = mockedWriteFile.mock.calls[0];
    const [writeArg1, writeArg2]: string[] = writeCall1;

    expect(writeArg1.endsWith(fixture.constants.CONFIG_FILE)).toBeTruthy();
    expect(writeArg2).toEqual(fixture.configFile);
  });

  it("parses the config file", () => {
    configFileExists = true;
    delete require.cache[require.resolve("./configuration")];
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
