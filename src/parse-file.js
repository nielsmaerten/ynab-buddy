const fs = require("fs");
const parse = require("./parse-csv");

module.exports = filepath => {
  let contents = fs.readFileSync(filepath).toString();
  return parse(contents, filepath);
};
