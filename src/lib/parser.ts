import { BankFile, Configuration, ParsedBankFile, Parser, Transaction } from "../types";
import parseCsv from "csv-parse/lib/sync";
import { Options as parseOptions } from "csv-parse";
import fs from "fs";

export function parseBankFile(source: BankFile, parsers: Parser[]) {
  const csv = fs.readFileSync(source.path);

  const parser = parsers.find((p) => p.name === source.matchedParser)!;
  const parseOptions = { ...baseParseOptions };
  parseOptions.columns = parser.columns.filter(noDuplicates);

  const records = parseCsv(csv, parseOptions);
  const transactions: Transaction[] = records.map(buildTransaction)

  transactions.forEach(tx => {
    // TODO: next step: where should we multiply the amount by 1000?
    // here? in index? just before upload?
    // when we save the ynab csv, should the factor have been applied already?
    // we should be able to override this factor in the config file
    // this should be possible per parser
    tx.account_id = source.matchedPattern?.ynab_account_id
    tx.flag_color = source.matchedPattern?.ynab_flag_color
    tx.amount = tx.amount * (parser.amountOffset || 1000);
  })

  const parseResult: ParsedBankFile = {
    transactions,
    bankFile: source
  }
  return parseResult;
}

export function buildTransaction(record: any): Transaction {
  let amount = record.Inflow || -record.Outflow

  return {
    amount,
    date: new Date(),
    memo: record.Memo,
  }
}

const baseParseOptions: parseOptions = {
  skipEmptyLines: true,
  relaxColumnCount: true,
};

function noDuplicates<T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) === index;
}
