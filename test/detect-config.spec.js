const detectConfig = require("../src/parsing-tools/detect-config");
const path = require("path");
const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

describe("Config detector", () => {
  let testDataPath = path.resolve("./test/test-files");
  let testFiles = fs.readdirSync(testDataPath);
  let getFilePath = fileName => path.resolve(testDataPath, fileName);

  it("can find a config for each test file", () => {
    testFiles.forEach(filename => {
      let contents = fs.readFileSync(getFilePath(filename)).toString();
      let result = detectConfig(contents, filename);

      expect(result).to.not.equal(undefined, `Unable to detect config of: ${filename}`);
    });
  });
});
