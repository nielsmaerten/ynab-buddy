const parseDate = require("fecha").parse;

/**
 * Converts dates and numbers in a Transaction object to strong types
 * @param {any} transaction A Transaction object parsed from CSV without dynamic typing
 * @param {any} config A bank2ynab config object
 */
const fixTypes = (transaction, config) => {
  transaction.Date = fixDate(transaction.Date, config);
  if (transaction.Inflow) transaction.Inflow = fixNumber(transaction.Inflow);
  if (transaction.Outflow) transaction.Outflow = fixNumber(transaction.Outflow);
  if (transaction.Amount) transaction.Amount = fixNumber(transaction.Amount);
  return transaction;
};

const fixDate = (value, config) => {
  if (typeof value === "string" && config.dateFormat) {
    let localDate = parseDate(value, getDateFormat(config));
    if (!localDate) return undefined;

    let yyyy = localDate.getFullYear();
    let mm = String(localDate.getMonth() + 1).padStart(2,0);
    let dd = localDate.getDate();
    
    return `${yyyy}-${mm}-${dd}`;
  } else return value;
};

/**
 * From Python-style date format to Javascript Fecha style
 */
const getDateFormat = config => {
  let formatString = config.dateFormat;
  return formatString
    .replace("%y", "YY")
    .replace("%Y", "YYYY")
    .replace("%m", "MM")
    .replace("%b", "MMM")
    .replace("%B", "MMMM")
    .replace("%d", "DD")
    .replace("%H", "HH")
    .replace("%M", "mm")
    .replace("%S", "ss");
};

const fixNumber = value => {
  if (value === undefined || typeof value === "Number") {
    // Bail
    return value;
  }

  const possible_decimal_separators = [",", ".", "'"];

  // Replace all instances of possible separators with a '.'
  possible_decimal_separators.forEach(sep => {
    value = value.replace(sep, ".");
  });

  // Remove all '.' except the last one
  value = value.replace(/\.(?=.*\.)/g, "");

  // Remove all chars that are not: a digit, '-' or '.'
  value = value.replace(/[^\d.-]/g, "");

  return parseFloat(value);
};

module.exports = fixTypes;
