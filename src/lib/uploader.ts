import { Configuration, ParsedBankFile, Transaction } from "../types";
import * as ynab from "ynab";
import chalk from "chalk";
import { messages } from "../constants";

export function upload(parsedFile: ParsedBankFile, config: Configuration) {
  const matchedPattern = parsedFile.source.matchedPattern!;
  const flagColor = matchedPattern.ynab_flag_color;
  const accountId = matchedPattern.ynab_account_id;
  const budgetId = matchedPattern.ynab_budget_id;
  const uploadFile = matchedPattern.upload;
  const uploadGeneral = config.ynab.upload;
  const token = config.ynab.token;

  if (!shouldUpload(uploadFile, uploadGeneral)) return;

  const transactions = parsedFile.transactions.map((tx) =>
    addYnabProps(tx, accountId, flagColor)
  );

  transactions.sort((a, b) => {
    if (a.import_id > b.import_id) return 1;
    else if (a.import_id < b.import_id) return -1;
    return 0;
  });

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    const prev_tx = transactions[i - 1] || {};
    const sameAmount = tx.amount === prev_tx.amount;
    const sameDate = tx.date === prev_tx.date;
    if (sameAmount && sameDate) {
      tx.occurrence = prev_tx.occurrence + 1;
    }
    tx.import_id = `${tx.import_id}${tx.occurrence}`;
  }

  return sendToYnab(transactions, budgetId, token);
}

export const sendToYnab = (TXs: any[], budgetId: string, token: string) => {
  const payload = {
    transactions: TXs,
  };
  const API = new ynab.API(token);
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
function addYnabProps(tx: Transaction, accountId: string, flagColor: string) {
  // Amount is expressed in milliunits. Any precision beyond 0.001 is discarded
  const milliunits = Math.floor(tx.amount * 1000);

  // This is only a partial importId. Occurrence will be added in the next step
  const yyyymmdd = tx.date.toISOString().substring(0, 10);
  const importId = `YNAB:${milliunits}:${yyyymmdd}:`;

  return {
    ...tx,
    date: yyyymmdd,
    import_id: importId,
    amount: milliunits,
    cleared: ynab.SaveTransaction.ClearedEnum.Cleared,
    account_id: accountId,
    flag_color: getFlagColor(flagColor),
    memo: tx.memo.substring(0, 200),
    occurrence: 1,
  };
}

function getFlagColor(color: string) {
  if (!color) return undefined;
  switch (color.toLowerCase().trim()) {
    case "blue":
      return ynab.SaveTransaction.FlagColorEnum.Blue;
    case "green":
      return ynab.SaveTransaction.FlagColorEnum.Green;
    case "orange":
      return ynab.SaveTransaction.FlagColorEnum.Orange;
    case "purple":
      return ynab.SaveTransaction.FlagColorEnum.Purple;
    case "red":
      return ynab.SaveTransaction.FlagColorEnum.Red;
    case "yellow":
      return ynab.SaveTransaction.FlagColorEnum.Yellow;
  }
}

//       // Add ids to prevent duplicate imports
//       .map(addImportId),
//   };
// };

// const count = {};
// /**
//  * From YNAB's API docs: the import_id is a string property that can be added to Transactions.
//  * It's used to match up Transactions that have been imported multiple times, or from different sources.
//  * An importId has the following format: `YNAB:[milliunit_amount]:[iso_date]:[occurrence]`
//  * Occurrence starts at 1, but if there's another transaction with the exact same amount on
//  * the same day, it would have an Occurrence of 2.
//  */
// const addImportId = (t) => {
//   // Build the first part of import_id (YNAB:date:amount)
//   let milliunit_amount = t.amount;
//   let iso_date = t.date;
//   let amount_date = `YNAB:${milliunit_amount}:${iso_date}`;

//   // If this import_id was not seen before, init it's count at 0
//   if (count[amount_date] === undefined) {
//     count[amount_date] = 0;
//   }

//   // Increment for this occurrence
//   count[amount_date]++;

//   // Set the full import_id (YNAB:date:amount:occurrence)
//   t.import_id = `${amount_date}:${count[amount_date]}`;
//   return t;
// };
