const validateConfig = require("./validate-config");
const bank2ynab_configs = require("../bank2ynab").getConfigs();

/**
 * Find a bank2ynab configuration that can be used to parse the CSV
 * @param {string} csvString A raw CSV string from a bank export file. Required
 * @param {string} filename The name of the bank export file. Required
 * @returns bank2ynab config object, or undefined if none was found
 */
const detectConfig = (csvString, filename) => {
  // Use filename to narrow all available Configs down to a list of Candidates
  let candidates = bank2ynab_configs.filter(config => {
    let regex = new RegExp(config.filenamePattern);
    return regex.test(filename);
  });

  // Test each Candidate to see if it produces a valid Transaction
  let compatible_config = candidates.find(candidate => {
    return validateConfig(csvString, candidate);
  });

  return compatible_config;
};

module.exports = detectConfig
