const chai = require("chai");
const expect = chai.expect;
const Proxy = require("../src");
const testData = require("./test-data");
const path = require("path");
const fs = require("fs");

describe("saveResult()", () => {
  let input = path.resolve("test/test-files", testData.files.withValidDefaultConfigs[0]);

  it("writes a parseResult to a YNAB CSV file", () => {
    let result = Proxy.parser.file(input);
    let r = Math.floor(Math.random() * 100000);
    let output = path.resolve("test/.tmp/", `${r}.csv`);

    Proxy.saveResult(result, output);
    expect(fs.existsSync(output)).to.equal(true);

    fs.unlinkSync(output);
  });
});
