const chai = require("chai");
const expect = chai.expect;
const buddy = require("../src");
const testData = require("./test-data");

describe("parser.csv()", () => {
  it("accepts a CSV string + filename", () => {
    buddy.parser.csv(testData.csvString, "my-test-file");
  });

  it("returns a parseResult", () => {
    let result = buddy.parser.csv(testData.valid.csvString, testData.valid.filename);
    expect(result).to.not.equal(undefined);
  });
});
