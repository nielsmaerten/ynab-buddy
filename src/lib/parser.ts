import { BankFile, ParsedBankFile, Parser, Transaction } from "../types.js";
import { parse as parseCsv, Options as ParseOptions } from "csv-parse/sync";
import { DateTime } from "luxon";
import fs from "fs";
import chalk from "chalk";
import { messages } from "../constants.js";
import * as hooks from "./hooks-loader.js";

export function parseBankFile(source: BankFile, parsers: Parser[]) {
  const _csv = fs.readFileSync(source.path).toString();
  console.log(`\n${messages.parsing}`, source.path);

  // Configure parser to detect the right columns and delimiter
  const parser = parsers.find((p) => p.name === source.matchedParser)!;
  const _parseOptions = { ...baseParseOptions };
  _parseOptions.columns = parser.columns.map(unifyColumns);
  _parseOptions.delimiter = parser.delimiter;

  const csv = hooks.onCsvLoaded(_csv);
  const parseOptions = hooks.onParseOptionsLoaded(_parseOptions);
  parseOptions.onRecord = hooks.onRecord;
  let records: any[] = parseCsv(csv, parseOptions);

  // Delete header and footer rows
  const startRow = parser.header_rows;
  const endRow = records.length - parser.footer_rows;
  records = records.slice(startRow, endRow).map(deduplicateColumns);

  const transactions = records
    .map((record) => {
      const tx = buildTransaction(record, parser);
      return hooks.onTransaction(tx, record);
    })
    .filter((tx) => tx);
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
    // Payee_name longer than 99 chars breaks YNAB, so we truncate it
    // https://github.com/nielsmaerten/ynab-buddy/discussions/42
    payee_name: record.payee?.trim().slice(0, 99),
  };
  if (!tx.payee_name) delete tx.payee_name;
  return tx;
}

function mergeMemoFields(record: any) {
  // Merge fields named memo, memo1, memo2, etc. into a single memo field
  const memoFields = Object.keys(record)
    .filter((key) => key.match(/^memo[0-9]*$/))
    .sort();
  const allMemos = memoFields.map((key) => record[key]?.trim());
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

  // Invert the value if this transaction is an outflow
  const hasOutflowFlag = Boolean(in_out_flag?.startsWith(outflow_indicator));
  const hasOutflowColumn = outflow?.length > 0;
  const hasInflowColumn = inflow?.length > 0;
  const isOutflow = (hasOutflowColumn && !hasInflowColumn) || hasOutflowFlag;
  if (isOutflow) {
    value = Math.abs(value) * -1;
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
    columnLowerCase.match(regex),
  );
  if (isAllowed) return columnLowerCase;
  else return `__${index}`;
}

/**
 * If a CSV has columns with the same name, the parser will create an array of values.
 * If a prop on the record is an array, we take the first non-empty value.
 * This is a fix for https://github.com/nielsmaerten/ynab-buddy/issues/45
 */
function deduplicateColumns(record: any) {
  const deduplicatedRecord: any = {};
  Object.keys(record).forEach((key) => {
    const value = record[key];
    if (Array.isArray(value)) {
      deduplicatedRecord[key] = value.find((v) => v?.length > 0);
    } else {
      deduplicatedRecord[key] = value;
    }
  });
  return deduplicatedRecord;
}

const baseParseOptions: ParseOptions = {
  skipEmptyLines: true,
  relaxColumnCount: true,
};
