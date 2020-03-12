const ynab = require("ynab");

module.exports = async (transactions, ynabToken, budgetId, accountId, color) => {
  const api = new ynab.API(ynabToken);
  const data = prepForYnab(transactions, accountId, color);
  const apiResponse = await api.transactions.createTransactions(budgetId, data);

  return apiResponse;
};

const prepForYnab = (transactions, account_id, color) => {
  return {
    transactions: transactions

      // Skip transactions that do not have a date
      .filter(t => t.Date)

      .map(t => {
        return {
          //category_id: "8d505bc0-efbe-4803-b8ef-0898213a1092",
          //payee_id: null,
          //approved: true,
          cleared: ynab.SaveTransaction.ClearedEnum.Cleared,
          account_id,
          date: t.Date,
          flag_color: color,
          amount: Math.floor(getAmount(t)),
          memo: String(t.Memo).substring(0, 200)
        };
      })

      // Add ids to prevent duplicate imports
      .map(addImportId)
  };
};

const count = {};
/**
 * From YNAB's API docs: the import_id is a string property that can be added to Transactions.
 * It's used to match up Transactions that have been imported multiple times, or from different sources.
 * An importId has the following format: `YNAB:[milliunit_amount]:[iso_date]:[occurrence]`
 * Occurrence starts at 1, but if there's another transaction with the exact same amount on
 * the same day, it would have an Occurrence of 2.
 */
const addImportId = t => {
  // Build the first part of import_id (YNAB:date:amount)
  let milliunit_amount = t.amount;
  let iso_date = t.date;
  let amount_date = `YNAB:${milliunit_amount}:${iso_date}`;

  // If this import_id was not seen before, init it's count at 0
  if (count[amount_date] === undefined) {
    count[amount_date] = 0;
  }

  // Increment for this occurrence
  count[amount_date]++;

  // Set the full import_id (YNAB:date:amount:occurrence)
  t.import_id = `${amount_date}:${count[amount_date]}`;
  return t;
};

const getAmount = transaction => {
  if (transaction.Inflow) return transaction.Inflow * 1000;
  if (transaction.Amount) return transaction.Amount * 1000;
  if (transaction.Outflow) return transaction.Outflow * 1000 * -1;
};
