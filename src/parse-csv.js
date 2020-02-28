const parsingTools = require("./parsing-tools");

/**
 * Turn CSV content into YNAB compatible Transactions
 * @param {string} csvString A raw CSV string from a bank export file. Required
 * @param {string} filename The name of the bank export file. Required
 */
const parseCsv = (csvString, filename) => {
  let config = parsingTools.detectConfig(csvString, filename);

  if (!config) {
    return {
      error: "found_no_matching_config",
      success: false,
      name: filename
    };
  }

  return parsingTools.parse(csvString, filename, config);
};

module.exports = parseCsv