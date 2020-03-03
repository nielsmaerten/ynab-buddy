const Papa = require("papaparse");
// TODO
module.exports = (parseResult, output) => {
  let transactions = parseResult.transactions.filter(t => {
    // Transactions that have no valid Date should be skipped
    return !t.Date;
  });

  let csvString = Papa.unparse(transactions, {
    header: true
  });
  debugger;
  return {};
};
