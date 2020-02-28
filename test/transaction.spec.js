const Proxy = require("../src");
const expect = require("chai").expect;
const testData = require("./test-data");

describe("Transaction", () => {
  let result = Proxy.parser.csv(testData.csvStrings.valid, testData.csvStrings.validFilename);

  it("has a 'Date' property", () => {
    expect(result.transactions[0]).to.haveOwnProperty("Date");
  });

  it("has a 'Payee' property", () => {
    expect(result.transactions[0]).to.haveOwnProperty("Payee");
  });

  it("has a 'Memo' property", () => {
    expect(result.transactions[0]).to.haveOwnProperty("Memo");
  });

  it("has either 'Outflow' and 'Inflow'; or 'Amount' properties", () => {
    let hasAmount = result.transactions[0].hasOwnProperty("Amount");
    let hasInflow = result.transactions[0].hasOwnProperty("Inflow");
    let hasOutflow = result.transactions[0].hasOwnProperty("Outflow");

    let testPassed = hasAmount || (hasInflow && hasOutflow);
    expect(testPassed).to.equal(true);
  });
});
