const fs = require("fs");

module.exports = {
  csvStrings: {
    example: `
        Account,Inflow,Description,Date
        ABC123,420.69,Hello World,2020-02-01
    `,
    valid: readValidTestFile(),
    validFilename: "export_BE11123456789012_20180304_1422.csv",
    invalid: "LOL N0PE"
  }
};

function readValidTestFile() {
  const filename = "export_BE11123456789012_20180304_1422.csv";
  const buffer = fs.readFileSync("test/test-files/" + filename);
  return buffer.toString();
}
