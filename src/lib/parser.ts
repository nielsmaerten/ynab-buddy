import { BankFile, ParsedBankFile, Parser, Transaction } from "../types";
import parseCsv from "csv-parse/lib/sync";
import { Options as parseOptions } from "csv-parse";
import { DateTime } from "luxon";
import fs from "fs";
import chalk from "chalk";
import { messages } from "../constants";

export function parseBankFile(source: BankFile, parsers: Parser[]) {
  const csv = fs.readFileSync(source.path);
  console.log(`\n${messages.parsing}`, source.path);

  // Configure parser to detect the right columns and delimiter
  const parser = parsers.find((p) => p.name === source.matchedParser)!;
  const parseOptions = { ...baseParseOptions };
  parseOptions.columns = parser.columns.map(unifyColumns);
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
  const tx: Transaction = {
    amount: parseAmount(record, parser),
    date: parseDate(record, parser.date_format),
    memo: mergeMemoFields(record),
  };
  if (record.payee) tx.payee_name = record.payee;
  return tx;
}

function mergeMemoFields(record: any) {
  // Merge fields named memo, memo1, memo2, etc. into a single memo field
  const memoFields = Object.keys(record)
    .filter((key) => key.match(/^memo[0-9]*$/))
    .sort();
  const allMemos = memoFields.map((key) => record[key]);
  return allMemos.join(" ");
}

function parseDate(record: any, dateFormat: string) {
  const { date } = record;
  const dateTime = DateTime.fromFormat(date.trim(), dateFormat, {
    zone: "UTC",
  });
  if (dateTime.isValid) return dateTime.toJSDate();

  const error = messages.parseDateError.join("\n");
  console.error(chalk.redBright(error), date, dateFormat);
  throw "PARSING ERROR";
}

function parseAmount(record: any, parser: Parser): number {
  const { thousand_separator, decimal_separator, outflow_indicator } = parser;
  const { inflow, outflow, amount, in_out_flag } = record;
  let value = inflow || outflow || amount;

  if (typeof value === "string") {
    if (thousand_separator) {
      value = value.replace(thousand_separator, ""); // 69.420,00 -> 69420.00
    }

    if (decimal_separator) {
      value = value.replace(decimal_separator, "."); // 69420,00 -> 69420.00
    }

    if (!decimal_separator && !thousand_separator) {
      // Backwards compatibility: if value has a ',' convert it to a '.'
      value = value.replace(",", ".");
    }

    // Remove non digit, non decimal separator, non minus characters
    value = value.replace(/[^0-9-.]/g, ""); // $420.69 -> 420.69

    value = parseFloat(value); // "420.69" ==> 420.69
  }

  // If the outflow column exists, OR
  // If the in_out_flag column exists AND it contains the outflow indicator
  // invert the value of the amount
  if (outflow !== undefined || in_out_flag?.startsWith(outflow_indicator)) {
    value = -value; // 420.69 ==> -420.69
  }

  return value;
}

function logResult(txCount: number, sourcePath: string) {
  const msg = chalk.greenBright(messages.parsingDone);
  console.log(msg, txCount);
}

/**
 * Turns a list of column names into a list where only allowed columns exist.
 * Ignored columns are kept, but receive a unique name.
 * That way they are still parsed, but ignored later on.
 * Example input: ['skip', 'memo', 'skip', 'Date', 'Inflow', 'Foobar', 'memo2'] ==>
 * output: ['_0', 'memo', '_1', 'date', 'inflow', '_3', 'memo2']
 */
function unifyColumns(columnName: string, index: number) {
  const columnLowerCase = columnName.toLowerCase();
  const allowedColumns = [
    /^date$/,
    /^inflow$/,
    /^outflow$/,
    /^amount$/,
    /^memo[0-9]*$/,
    /^in_out_flag$/,
    /^payee$/,
  ];
  const isAllowed = allowedColumns.some((regex) =>
    columnLowerCase.match(regex)
  );
  if (isAllowed) return columnLowerCase;
  else return `__${index}`;
}

const baseParseOptions: parseOptions = {
  skipEmptyLines: true,
  relaxColumnCount: true,
};
