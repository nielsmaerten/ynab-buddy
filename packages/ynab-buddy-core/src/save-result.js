const Papa = require("papaparse");
const fs = require("fs");

module.exports = (parseResult, output) => {
  let transactions = parseResult.transactions.filter(t => {
    // Transactions that have no valid Date should be skipped
    return t.Date;
  });

  let csvString = Papa.unparse(transactions, {
    header: true
  });

  fs.writeFileSync(output, csvString);
  return output;
};
