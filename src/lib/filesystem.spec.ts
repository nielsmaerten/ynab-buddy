import {
  liveConfig,
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