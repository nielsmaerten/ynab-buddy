const chai = require("chai");
const expect = chai.expect;
const Proxy = require("../src");
const path = require("path");
const fs = require("fs");

describe("parser.file()", () => {
  let testDataPath = path.resolve("./test/test-files");
  let testFiles = fs.readdirSync(testDataPath);
  let getFilePath = fileName => path.resolve(testDataPath, fileName);

  it("accepts a file path", () => {
    Proxy.parser.file(getFilePath(testFiles[0]));
  });

  it("returns a parseResult", () => {
    let result = Proxy.parser.file(getFilePath(testFiles[0]));
    expect(result).to.not.equal(undefined);
  });
});
