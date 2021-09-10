import { BankFile, ParsedBankFile, Parser, Transaction } from "../types";
import parseCsv from "csv-parse/lib/sync";
import { Options as parseOptions } from "csv-parse";
import { DateTime } from "luxon";
import fs from "fs";
import chalk from "chalk";
import { messages } from "../constants";
import path from "path";

export function parseBankFile(source: BankFile, parsers: Parser[]) {
  const csv = fs.readFileSync(source.path);

  // Configure parser to detect the right columns and delimiter
  const parser = parsers.find((p) => p.name === source.matchedParser)!;
  const parseOptions = { ...baseParseOptions };
  parseOptions.columns = parser.columns.filter(noDuplicates);
  parseOptions.delimiter = parser.delimiter;

  let records: any[] = parseCsv(csv, parseOptions);

  // Delete header and footer rows
  const startRow = parser.header_rows;
  const endRow = records.length - parser.footer_rows;
  records = records.slice(startRow, endRow);

  const transactions = records.map((tx) => buildTransaction(tx, parser));
  logResult(transactions.length, source.path);
  return {
    transactions,
    source,
  } as ParsedBankFile;
}

export function buildTransaction(record: any, parser: Parser): Transaction {
  return {
    amount: parseAmount(record),
    date: DateTime.fromFormat(record.Date, parser.date_format).toJSDate(),
    memo: record.Memo,
  };
}

function parseAmount(record: any): number {
  const { Inflow, Outflow, Amount } = record;
  let value = Inflow || Outflow || Amount;

  if (typeof value === "string") {
    value = value.replace(",", "."); // "420,69" ==> "420.69"
    value = parseFloat(value); // "420.69" ==> 420.69
  }

  if (Outflow !== undefined) {
    value = -value; // 420.69 ==> -420.69
  }

  return value;
}

function logResult(txCount: number, sourcePath: string) {
  const txCountLabel = chalk.blueBright(txCount);
  const sourceLabel = chalk.blueBright(path.basename(sourcePath));
  console.log(messages.parsingDone, txCountLabel, sourceLabel);
}

function noDuplicates<T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) === index;
}

const baseParseOptions: parseOptions = {
  skipEmptyLines: true,
  relaxColumnCount: true,
};
