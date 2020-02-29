const parse = require("./parse");

/**
 * Quickly tests if a config manages to parse valid Transactions from a csvString
 */
const validate = (csvString, config) => {
  let transactions = parse(csvString, config, true);
  if (transactions.length === 0) return false;

  let hasDate = checkProperty(transactions[0], "Date", "Date");
  let hasAmount = checkProperty(transactions[0], "Amount", "Number");
  let hasInflow = checkProperty(transactions[0], "Inflow", "Number");
  let hasOutflow = checkProperty(transactions[0], "Outflow", "Number");

  let isValidTransaction = hasDate && (hasInflow || hasOutflow || hasAmount);

  // FIXME: Some files still fall through the cracks,
  // It might be useful to have a 'nuclear' option here,
  // which will just try all configs and pick one that
  // manages to deliver a valid transaction?
  return isValidTransaction;
};

const checkProperty = (transaction, propName, type) => {
  let hasProperty = transaction.hasOwnProperty(propName);
  let isRightType = typeof transaction[propName] === type;
  return hasProperty && isRightType;
};

module.exports = validate;
