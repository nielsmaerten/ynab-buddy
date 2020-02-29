const parsingTools = require("./parsing-tools");

/**
 * Turn CSV content into YNAB compatible Transactions
 * @param {string} csvString A raw CSV string from a bank export file. Required
 * @param {string} filename The name of the bank export file. Required
 */
const parseCsv = (csvString, filename) => {
  // Required parameters present?
  if (!csvString || !filename) return result("required_param_missing", filename);

  // Find a matching bank2ynab config
  let config = parsingTools.detectConfig(csvString, filename);
  if (!config) return result("no_matching_config", filename);

  // Parse Transactions
  let transactions = parsingTools.parse(csvString, config);
  if (transactions.length === 0) return result("found_no_transactions", filename);

  return result(undefined, filename, transactions);
};

/**
 * @param {string} error
 * @param {string} filename
 * @param {any[]} transactions
 */
function result(error, filename, transactions) {
  return {
    error,
    success: !error,
    name: filename,
    transactions: transactions || []
  };
}

module.exports = parseCsv;
