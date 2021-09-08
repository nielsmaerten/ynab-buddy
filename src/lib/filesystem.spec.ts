import { testBankFilePatterns, testFiles } from "./filesystem.spec.fixtures";
import { detectBank } from "./filesystem";

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
