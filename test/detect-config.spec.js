const detectConfig = require("../src/parsing-tools/detect-config");
const testData = require("./test-data");
const path = require("path");
const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

describe("Config detector", () => {
  let testDataPath = path.resolve("./test/test-files");
  let testFiles = testData.files.withValidDefaultConfigs;
  let getFilePath = fileName => path.resolve(testDataPath, fileName);

  it("can find a config for each test file", () => {
    let errors = [];

    testFiles.forEach(filename => {
      let contents = fs.readFileSync(getFilePath(filename)).toString();
      let result = detectConfig(contents, filename);
      if (!result) errors.push(filename);
    });

    let msg = `Failed to detect configs of: \n- ${errors.join("\n- ")}\n`;
    expect(errors).to.be.of.length(0, msg);
  });
});
