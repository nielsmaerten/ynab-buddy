const chai = require("chai");
const expect = chai.expect;
const Proxy = require("../src");
const path = require("path");
const fs = require("fs");
const customConfigs = require("./test-data").customConfigs;

describe("All test files", () => {
  let testDataPath = path.resolve("./test/test-files");
  let testFiles = fs.readdirSync(testDataPath);
  let getFilePath = fileName => path.resolve(testDataPath, fileName);

  it("are parsed successfully", () => {
    let errors = [];

    testFiles.forEach(filename => {
      let testFilePath = getFilePath(filename);
      let result = Proxy.parser.file(testFilePath, customConfigs[filename]);
      if (!result.success) errors.push(filename);
    });

    let msg = `Failed to parse: \n- ${errors.join("\n- ")}\n`;
    expect(errors).to.be.of.length(0, msg);
  });
});
