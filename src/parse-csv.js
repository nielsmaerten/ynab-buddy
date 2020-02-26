const parsingTools = require("./parsing-tools");
const bank2ynab_configs = require("./bank2ynab").getConfigs();

/**
 * Turn CSV content into YNAB compatible Transactions
 * @param csvString {string} A raw CSV string from a bank export file. Required
 * @param filename {filename} The name of the bank export file. Required
 */
const parseCsv = (csvString, filename) => {
  // Use filename to narrow down the list of Candidates to the ones
  // that can possibly parse the CSV string
  let candidates = bank2ynab_configs.filter(config => {
    let regex = new RegExp(config.filenamePattern);
    return regex.test(filename);
  });

  // Test each Candidate to see if it produces a valid Transaction
  let matching_config = candidates.find(candidate => {
    return parsingTools.isConfigCompatible(candidate, csvString);
  });

  // Error out if none of the Candidates work
  if (!matching_config) {
    return {
      error: "found_no_matching_config",
      success: false,
      name: filename
    };
  }

  // Use the matching Candidate as a config to parse the CSV string
  return parsingTools.parse(csvString, filename, matching_config);
};

module.exports = parseCsv;
