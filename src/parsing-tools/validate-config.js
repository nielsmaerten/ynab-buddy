const Papa = require("papaparse");
const parse = require("./parse");

/**
 * Quickly tests if a config manages to parse valid Transactions from a csvString
 */
const validate = (csvString, config) => {
  let transactions = parse(csvString, config, true);
  if (transactions.length === 0) return false;

  let hasDate = transactions[0].hasOwnProperty("Date");
  let hasAmount = transactions[0].hasOwnProperty("Amount");
  let hasInflow = transactions[0].hasOwnProperty("Inflow");
  let hasOutflow = transactions[0].hasOwnProperty("Outflow");

  let isValidTransaction = hasDate && (hasInflow || hasOutflow || hasAmount);

  // FIXME: Some files still fall through the cracks,
  // It might be useful to have a 'nuclear' option here,
  // which will just try all configs and pick one that
  // manages to deliver a valid transaction?
  return isValidTransaction;
};

module.exports = validate;
