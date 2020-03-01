const parsingTools = require("./parsing-tools");

/**
 * Turn CSV content into YNAB compatible Transactions
 * @param {string} csvString A raw CSV string from a bank export file. Required
 * @param {string} filename The name of the bank export file. Required
 * @param {any} customConfig Will be merged with detected config. Optional
 */
const parseCsv = (csvString, filename, customConfig) => {
  // Required parameters present?
  if (!csvString || !filename) return result("required_param_missing", filename);

  // Find a matching bank2ynab config
  let config = parsingTools.detectConfig(csvString, filename);
  if (!config && customConfig) config = customConfig;
  else if (config && customConfig) Object.assign(config, customConfig);
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
const result = (error, filename, transactions) => {
  return {
    error,
    success: !error,
    name: filename,
    transactions: transactions || []
  };
};

module.exports = parseCsv;
