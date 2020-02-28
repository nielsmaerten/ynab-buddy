const Papa = require("papaparse");

module.exports = (csvString, config) => {
  // Parse the first line of the CSV string
  let parsed = Papa.parse(csvString, {
    preview: 1 + config.headerRows,
    // Papa will guess delimiter if undefined
    delimiter: config.delimiter,
    dynamicTyping: false
  });

  // Build Transaction object from parsed data
  let transaction = {};
  let csvTransaction = parsed.data[parsed.data.length - 1];
  config.inputColumns.forEach((column, i) => {
    if (column !== "skip") {
      transaction[column] = csvTransaction[i];
    }
  });

  // Validate the resulting Transaction object
  let hasDate = transaction.hasOwnProperty("Date");
  let hasAmount = transaction.hasOwnProperty("Amount");
  let hasInflow = transaction.hasOwnProperty("Inflow");
  let hasOutflow = transaction.hasOwnProperty("Outflow");

  let isValidTransaction = hasDate && (hasInflow || hasOutflow || hasAmount);

  // FIXME: Some files still fall through the cracks,
  // It might be useful to have a 'nuclear' option here,
  // which will just try all configs and pick one that
  // manages to deliver a valid transaction?
  return isValidTransaction;
};
