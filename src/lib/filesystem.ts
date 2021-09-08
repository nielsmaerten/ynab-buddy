import { BankFile, Configuration, BankFilePattern } from "../types";
import minimatch from "minimatch";
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
  const cleanedBankFiles = bankFiles.filter((f) => f.isBankFile);
  return cleanedBankFiles;
}

/**
 * Detects if a file matches one of the BankFile patterns
 */
export function detectBank(file: string, patterns: BankFilePattern[]) {
  function findMatch(pattern: string) {
    const endsWithPattern = "**/" + pattern.toLowerCase();
    return minimatch(file.toLowerCase(), endsWithPattern);
  }

  const match = patterns.find(({ pattern }) => findMatch(pattern));
  return {
    isBankFile: !!match,
    matchedParser: match?.parser,
    matchedPattern: match,
    path: file,
  };
}

function getFiles(dir: string, recursive = false) {
  const pattern = path.join(dir, recursive ? "**/*" : "*");
  const matches = glob.sync(pattern);
  const files = matches.filter((match) => fs.lstatSync(match).isFile());
  return files;
}
