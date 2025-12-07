import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
} from "bun:test";
import {
  liveConfig,
  parsedBankFileFixture,
  testBankFilePatterns,
  testFiles,
} from "./filesystem.spec.fixtures";
import path from "path";
import { TEST_BANKS_DIR } from "../constants";

mock.restore();

const loadFilesystem = () => {
  delete require.cache[require.resolve("./filesystem")];
  return require("./filesystem") as typeof import("./filesystem");
};

describe("detectBank", () => {
  it("detects when a file is a BankFile", () => {
    const { detectBank } = loadFilesystem();
    const result = detectBank(testFiles.bankFile, testBankFilePatterns);
    expect(result.isBankFile).toBeTruthy();
    expect(result.matchedParser).toBeDefined();
    expect(result.matchedPattern).toBeDefined();
    expect(result.path).toEqual(testFiles.bankFile);
  });

  it("detects a nested file", () => {
    const { detectBank } = loadFilesystem();
    const result = detectBank(testFiles.nestedBankFile, testBankFilePatterns);
    expect(result.isBankFile).toBeTruthy();
    expect(result.matchedParser).toBeDefined();
    expect(result.matchedPattern).toBeDefined();
    expect(result.path).toEqual(testFiles.nestedBankFile);
  });

  it("returns isBankFile = false when no bank is detected", () => {
    const { detectBank } = loadFilesystem();
    const result = detectBank(testFiles.notBankFile, testBankFilePatterns);
    expect(result.isBankFile).toBeFalsy();
    expect(result.matchedParser).toBeUndefined();
    expect(result.matchedPattern).toBeUndefined();
    expect(result.path).toEqual(testFiles.notBankFile);
  });
});

describe("findBankFiles", () => {
  const cwd = process.cwd();
  const bankFilesDir = path.join(cwd, TEST_BANKS_DIR);

  it("finds files from bank A in top level", () => {
    const dir = path.join(bankFilesDir, "bankA/");
    const config = { ...liveConfig, searchSubDirectories: false };
    const { findBankFiles } = loadFilesystem();
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(1);
  });

  it("finds files from bank A in nested folders", () => {
    const dir = path.join(bankFilesDir, "bankA/");
    const config = { ...liveConfig, searchSubDirectories: true };
    const { findBankFiles } = loadFilesystem();
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(2);
  });

  it("finds files from bank B", () => {
    const dir = path.join(bankFilesDir, "bankB/");
    const config = { ...liveConfig, searchSubDirectories: false };
    const { findBankFiles } = loadFilesystem();
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(1);
  });

  it("finds files from bank C", () => {
    const dir = path.join(bankFilesDir, "bankC/");
    const config = { ...liveConfig, searchSubDirectories: true };
    const { findBankFiles } = loadFilesystem();
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(2);
  });

  it("finds all test files", () => {
    const config = { ...liveConfig, searchSubDirectories: true };
    const { findBankFiles } = loadFilesystem();
    const result = findBankFiles(bankFilesDir, config);
    expect(result).toHaveLength(5);
  });
});

describe("CSV Export (simulated)", () => {
  // Patch writeFileSync so we can spy on what's getting exported
  const fs = require("fs");
  const writeFileSync_original = fs.writeFileSync;
  const writeFileSync_mock = mock();
  let exportCsv: typeof import("./filesystem").exportCsv;
  beforeAll(() => {
    fs.writeFileSync = writeFileSync_mock;
    delete require.cache[require.resolve("./filesystem")];
    exportCsv = loadFilesystem().exportCsv;
  });
  afterAll(() => {
    fs.writeFileSync = writeFileSync_original;
  });
  beforeEach(() => writeFileSync_mock.mockReset());
  it("exports parsed file as YNAB.csv", () => {
    exportCsv(parsedBankFileFixture);
    expect(writeFileSync_mock).toHaveBeenCalled();

    const actual = writeFileSync_mock.mock.calls[0][1];
    const expected = `Amount,Date,Memo
420.69,1990-02-27,TEST MEMO
`;

    expect(actual).toEqual(expected);
  });

  it("skips files when saving is disabled", () => {
    const fixture = { ...parsedBankFileFixture };
    fixture.source.matchedPattern!.save_parsed_file = false;
    exportCsv({ ...parsedBankFileFixture });
    expect(writeFileSync_mock).not.toHaveBeenCalled();
  });
});
