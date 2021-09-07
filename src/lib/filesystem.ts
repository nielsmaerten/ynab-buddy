import { BankFile, Configuration, BankFilePattern } from "../types";
import glob from "glob";
import path from "path";
import fs from "fs";

/**
 * Finds all files eligible for parsing in the directory.
 * Each file that is detected as being from a bank is returned as a BankFile.
 * The other files in the directory are ignored.
 */
export function findBankFiles(dir: string, config: Configuration): BankFile[] {
  const { searchSubDirectories, bankFilePatterns } = config;

  // Get all files in the directory. Optionally include subFolders
  const allFiles = getFiles(dir, searchSubDirectories);

  // For every file, detect if it matches a bank's pattern
  const bankFiles = allFiles.map((file) => detectBank(file, bankFilePatterns));

  // Discard files that are not from banks
  const cleanedBankFiles = bankFiles.filter((f) => f !== undefined);
  return cleanedBankFiles;
}

/** * 
 * Detects is a file matches a bank pattern.
 * If yes, the file is wrapped as a BankFile and returned.
 * If not, we return undefined.
 */
export function detectBank(file: string, patterns: BankFilePattern[]): BankFile {
  return {
    isBankFile: true,
    matchedParser: 'test',
    matchedPattern: patterns[0],
    path: file
  }
}

function getFiles(dir: string, recursive = false) {
  const pattern = path.join(dir, recursive ? "**/*" : "*");
  const matches = glob.sync(pattern);
  const files = matches.filter((match) => fs.lstatSync(match).isFile());
  return files;
}
