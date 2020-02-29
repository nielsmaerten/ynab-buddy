const fs = require("fs");
const path = require("path");

const valid_filename = "export_BE11123456789012_20180304_1422.csv";
const valid_filepath = path.resolve("test/test-files", valid_filename);

const testData = {
  valid: {
    filename: valid_filename,
    filepath: valid_filepath,
    csvString: fs.readFileSync(valid_filepath).toString()
  },
  invalid: {
    filename: "LOL. N0PE",
    csvString: "LOL. N0PE"
  }
};

module.exports = testData;
