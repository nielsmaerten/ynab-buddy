const fs = require("fs");
const path = require("path");
const parseCsv = require("./parse-csv");

module.exports = (filepath, customConfig) => {
  let contents = fs.readFileSync(filepath).toString();
  return parseCsv(contents, path.basename(filepath), customConfig);
};
