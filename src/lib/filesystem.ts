import {
  BankFile,
  Configuration,
  BankFilePattern,
  ParsedBankFile,
} from "../types";
import minimatch from "minimatch";
import glob from "glob";
import path from "path";
import fs, { writeFileSync } from "fs";
import csvStringify from "csv-stringify/lib/sync";
import stringify from "csv-stringify";

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

/**
 * (Recursively) gets all files in a directory
 */
function getFiles(dir: string, recursive = false) {
  const pattern = path.join(dir, recursive ? "**/*" : "*");
  const matches = glob.sync(pattern);
  const files = matches.filter((match) => fs.lstatSync(match).isFile());
  return files;
}

/**
 * Writes a YNAB-compatible CSV file to disk
 */
export function exportCsv(result: ParsedBankFile) {
  const { source, transactions } = result;
  const shouldExport = source.matchedPattern?.save_parsed_file;
  if (!shouldExport) return;

  // Produce a CSV file that can be read by YNAB
  const castDate = (d: Date) => d.toISOString();
  const exportConfig: stringify.Options = {
    header: true,
    cast: { date: castDate },
  };
  const csvText = csvStringify(transactions, exportConfig);

  // Export file will be named: [ORIGINAL_FILENAME].YNAB.csv
  // and saved to the same folder
  const originalFileName = path.basename(
    source.path,
    path.extname(source.path)
  );
  const parentFolder = path.dirname(source.path);
  const exportFileName = `${originalFileName}.YNAB.csv`;
  const destination = path.join(parentFolder, exportFileName);
  writeFileSync(destination, csvText);
}

export function cleanup(result: ParsedBankFile) {
  throw "todo";
}
