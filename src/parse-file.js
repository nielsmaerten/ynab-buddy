const fs = require("fs");
const parseCsv = require("./parse-csv");

module.exports = (filepath, customConfig) => {
  let contents = fs.readFileSync(filepath).toString();
  return parseCsv(contents, filepath, customConfig);
};
