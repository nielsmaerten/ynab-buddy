const Papa = require("papaparse");
const fixTypes = require("./fix-types");

/**
 * Parse a raw CSV string to Transactions according to the Config object.
 * @param {string} csvString A raw CSV string
 * @param {any} config A bank2ynab config object
 * @param {boolean} preview Set to true to only parse the first data line
 */
const parse = (csvString, config, preview) => {
  // If preview == true: only parse the first line of data
  // If preview == false: leave undefined to parse everything
  let pr = preview ? config.headerRows + 2 : undefined;

  // Use this delimiter if defined
  // If undefined, Papa will try to guess the delimiter
  let delimiter = config.delimiter;

  // Verify inputColumns are present
  let inputColumns = config.inputColumns;
  if (!inputColumns)
    throw new Error(`Config object ${JSON.stringify(config)} must have inputColumns`);

  // Parse csv and remove header/footer rows if present
  let parsed = Papa.parse(csvString, { preview: pr, delimiter, skipEmptyLines: true });
  parsed.data.splice(0, config.headerRows);
  parsed.data.splice(parsed.data.length - config.footerRows, config.footerRows);

  // Map each CSV line to a Transaction object
  let transactions = parsed.data

    .map(csv => {
      let newTransaction = {};
      inputColumns.forEach((column, i) => {
        if (column !== "skip" && csv[i] !== undefined) newTransaction[column] = csv[i].trim();
      });
      return newTransaction;
    })
    .filter(t => t.hasOwnProperty("Date"))
    .map(t => fixTypes(t, config));

  return transactions;
};

module.exports = parse;
