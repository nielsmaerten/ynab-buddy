const chai = require("chai");
const expect = chai.expect;
const Proxy = require("../src");
const path = require("path");
const fs = require("fs");

describe("All test files", () => {
  let testDataPath = path.resolve("./test/test-files");
  let testFiles = fs.readdirSync(testDataPath);
  let getFilePath = fileName => path.resolve(testDataPath, fileName);

  it("are parsed successfully", () => {
    testFiles.forEach(fileName => {
      let testFilePath = getFilePath(fileName);
      let result = Proxy.parser.file(testFilePath);
      expect(result).to.haveOwnProperty("success", true);
    });
  });
});
