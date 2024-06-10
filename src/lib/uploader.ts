import { Configuration, ParsedBankFile, Transaction } from "../types";
import * as YNAB from "ynab";
import chalk from "chalk";
import { messages } from "../constants";

export function upload(parsedFile: ParsedBankFile, config: Configuration) {
  // Get config values required for uploading
  const matchedPattern = parsedFile.source.matchedPattern!;
  const flagColor = matchedPattern.ynab_flag_color;
  const accountId = matchedPattern.ynab_account_id;
  const budgetId = matchedPattern.ynab_budget_id;
  const uploadFile = matchedPattern.upload;
  const uploadGeneral = config.ynab.upload;
  const token = config.ynab.token;

  // Bail if upload is disabled for this file, or globally
  if (!shouldUpload(uploadFile, uploadGeneral)) return;

  // Add YNAB-specific props to each transaction
  // This turns a BuddyTransaction into a YNAB.SaveTransaction
  const transactions: YNAB.SaveTransaction[] = parsedFile.transactions.map(
    (tx) => addYnabProps(tx, accountId, flagColor),
  );

  // Group transactions by import_id
  const txByImportId: { [importId: string]: YNAB.SaveTransaction[] } = {};
  transactions.forEach((tx) => {
    if (!txByImportId[tx.import_id!]) txByImportId[tx.import_id!] = [];
    txByImportId[tx.import_id!].push(tx);
  });

  // Add occurrence to import_id
  Object.values(txByImportId).forEach((txs) => {
    txs.forEach((tx, i) => {
      tx.import_id = `${tx.import_id}:${i + 1}`;
    });
  });

  // Flatten the array of transactions
  const uniqueTransactions = Object.values(txByImportId).flat();
  return sendToYnab(uniqueTransactions, budgetId, token);
}

export const sendToYnab = (
  TXs: YNAB.SaveTransaction[],
  budgetId: string,
  token: string,
) => {
  const payload: YNAB.PostTransactionsWrapper = {
    transactions: TXs,
  };
  const API = new YNAB.API(token);
  const response = API.transactions.createTransactions(budgetId, payload);
  response
    .then(() => {
      console.log(chalk.greenBright(messages.uploadSuccess), TXs.length);
    })
    .catch((error) => {
      const msg = messages.uploadError.join("\n");
      const detail = JSON.stringify(error);
      console.error(chalk.redBright(msg), detail);
      throw "UPLOAD ERROR";
    });
  return response;
};

/**
 * If this file is configured to upload, upload.
 * If this file is configured to skip upload, skip.
 * If this file is not configured but the general setting says upload, upload.
 * Otherwise, skip.
 */
function shouldUpload(uploadFile?: boolean, uploadGeneral?: boolean) {
  if (uploadFile) return true;
  else if (uploadFile === false) return false;
  else if (uploadGeneral) return true;
  else return false;
}

/**
 * Modify the props on a Transaction so they can be sent to the YNAB API
 * Refer to the YNAB API docs for more info on milliunits and the importId
 */
function addYnabProps(
  tx: Transaction,
  accountId: string,
  flagColor: string,
): YNAB.SaveTransaction {
  // Amount is expressed in milliunits. Any precision beyond 0.001 is discarded
  const milliunits = Math.floor(tx.amount * 1000);

  // YNAB expects a unique import_id for each transaction to allow for idempotent uploads.
  // The import_id can be any string, but it's convention to use the format:
  // `YNAB:${milliunits}:${yyyymmdd}:${occurrence}`
  // This lets ynab-buddy play nicely with other tools that might
  // upload the same transactions, including YNAB's own Auto Import feature.
  // Note that occurrence is no yet included here, but will be added later.
  const yyyymmdd = tx.date.toISOString().substring(0, 10);
  const importId = `YNAB:${milliunits}:${yyyymmdd}`;

  return {
    ...tx,
    date: yyyymmdd,
    import_id: importId,
    amount: milliunits,
    cleared: "cleared",
    account_id: accountId,
    flag_color: getFlagColor(flagColor),
    memo: tx.memo.substring(0, 200),
  };
}

function getFlagColor(color: string): YNAB.TransactionFlagColor | undefined {
  const validColor: string[] = Object.values(YNAB.TransactionFlagColor);
  if (validColor.includes(color)) return color as YNAB.TransactionFlagColor;
  else return undefined;
}
