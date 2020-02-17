const Proxy = require("../src");
const testData = require("./test-data");
const chai = require("chai");
const expect = chai.expect;

describe("Parser result", () => {
  let result = Proxy.parser.csv(testData.csvStrings.example);
  let failedResult = Proxy.parser.csv(testData.csvStrings.invalid);

  it("has a success property", () => {
    expect(result).to.haveOwnProperty("success");
  });

  it("has a name property", () => {
    expect(result).to.haveOwnProperty("name");
  });
  
  it("has a transactions array", () => {
    expect(result).to.haveOwnProperty("transactions");
    expect(result.transactions).to.be.an("array");
    expect(result.transactions.length).to.be.least(1);
  });

  it("has an error property when parsing fails", () => {
    expect(failedResult).to.haveOwnProperty("error");
    expect(failedResult.error).to.not.equal(undefined);
  });
});
