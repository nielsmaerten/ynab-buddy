const parse = require("./parse");

/**
 * Quickly tests if a config manages to parse valid Transactions from a csvString
 */
const validate = (csvString, config) => {
  let transactions = parse(csvString, config, true);
  if (transactions.length === 0) return false;

  let hasDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g.test(transactions[0].Date);
  let hasAmount = checkNumber(transactions[0], "Amount");
  let hasInflow = checkNumber(transactions[0], "Inflow");
  let hasOutflow = checkNumber(transactions[0], "Outflow");

  let isValidTransaction = hasDate && (hasInflow || hasOutflow || hasAmount);

  return isValidTransaction;
};

const checkNumber = (transaction, propName) => {
  let hasProperty = transaction.hasOwnProperty(propName);
  let property = transaction[propName];
  let isTypeNumber = typeof property === "number";

  return hasProperty && isTypeNumber;
};

module.exports = validate;
