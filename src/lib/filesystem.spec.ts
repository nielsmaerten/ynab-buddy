import {
  liveConfig,
  parsedBankFileFixture,
  testBankFilePatterns,
  testFiles,
} from "./filesystem.spec.fixtures";
import { detectBank, findBankFiles } from "./filesystem";
import path from "path";

describe("detectBank", () => {
  it("detects when a file is a BankFile", () => {
    const result = detectBank(testFiles.bankFile, testBankFilePatterns);
    expect(result.isBankFile).toBeTruthy();
    expect(result.matchedParser).toBeDefined();
    expect(result.matchedPattern).toBeDefined();
    expect(result.path).toEqual(testFiles.bankFile);
  });

  it("detects a nested file", () => {
    const result = detectBank(testFiles.nestedBankFile, testBankFilePatterns);
    expect(result.isBankFile).toBeTruthy();
    expect(result.matchedParser).toBeDefined();
    expect(result.matchedPattern).toBeDefined();
    expect(result.path).toEqual(testFiles.nestedBankFile);
  });

  it("returns isBankFile = false when no bank is detected", () => {
    const result = detectBank(testFiles.notBankFile, testBankFilePatterns);
    expect(result.isBankFile).toBeFalsy();
    expect(result.matchedParser).toBeUndefined();
    expect(result.matchedPattern).toBeUndefined();
    expect(result.path).toEqual(testFiles.notBankFile);
  });
});

describe("findBankFiles", () => {
  const cwd = process.cwd();
  const bankFilesDir = path.join(cwd, "fixtures/bank-files");

  it("finds files from bank A in top level", () => {
    const dir = path.join(bankFilesDir, "bankA/");
    const config = { ...liveConfig, searchSubDirectories: false };
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(1);
  });

  it("finds files from bank A in nested folders", () => {
    const dir = path.join(bankFilesDir, "bankA/");
    const config = { ...liveConfig, searchSubDirectories: true };
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(2);
  });

  it("finds files from bank B", () => {
    const dir = path.join(bankFilesDir, "bankB/");
    const config = { ...liveConfig, searchSubDirectories: false };
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(1);
  });

  it("finds files from bank C", () => {
    const dir = path.join(bankFilesDir, "bankC/");
    const config = { ...liveConfig, searchSubDirectories: true };
    const result = findBankFiles(dir, config);
    expect(result).toHaveLength(2);
  });

  it("finds all test files", () => {
    const config = { ...liveConfig, searchSubDirectories: true };
    const result = findBankFiles(bankFilesDir, config);
    expect(result).toHaveLength(5);
  });
});

describe("CSV Export (simulated)", () => {
  // Patch writeFileSync so we can spy on what's getting exported
  const fs = require("fs");
  const writeFileSync_original = fs.writeFileSync;
  const writeFileSync_mock = jest.fn();
  beforeAll(() => {
    delete fs.writeFileSync;
    fs.writeFileSync = writeFileSync_mock;
  });
  afterAll(() => {
    fs.writeFileSync = writeFileSync_original;
  });
  beforeEach(writeFileSync_mock.mockReset);

  const { exportCsv } = require("./filesystem");
  it("exports parsed file as YNAB.csv", () => {
    exportCsv(parsedBankFileFixture);
    expect(writeFileSync_mock).toHaveBeenCalled();

    const actual = writeFileSync_mock.mock.calls[0][1];
    const expected = `amount,date,memo
420.69,1990-02-27T00:00:00.000Z,TEST MEMO
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
