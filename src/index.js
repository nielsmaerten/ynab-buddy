const uploadResult = require("./upload-result");
const saveResult = require("./save-result");
const parseFile = require("./parse-file");
const parseCsv = require("./parse-csv");

module.exports = {
  parser: {
    file: parseFile,
    csv: parseCsv
  },
  uploadResult,
  saveResult
};
