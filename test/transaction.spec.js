const Proxy = require("../src");
const expect = require("chai").expect;
const testData = require("./test-data");

describe("Transaction", () => {
  let result = Proxy.parser.csv(testData.valid.csvString, testData.valid.filename);

  it("has a 'Date' property", () => {
    expect(result.transactions[0]).to.haveOwnProperty("Date");
    expect(result.transactions[0].Date).to.be.a("Date");
  });

  it("has a 'Payee' property", () => {
    expect(result.transactions[0]).to.haveOwnProperty("Payee");
  });

  it("has a 'Memo' property", () => {
    expect(result.transactions[0]).to.haveOwnProperty("Memo");
  });

  it("has 'Outflow', 'Inflow' or 'Amount' properties", () => {
    let hasAmount = result.transactions[0].hasOwnProperty("Amount");
    let hasInflow = result.transactions[0].hasOwnProperty("Inflow");
    let hasOutflow = result.transactions[0].hasOwnProperty("Outflow");

    let testPassed = hasAmount || hasInflow || hasOutflow;

    if (hasAmount) expect(result.transactions[0].Amount).to.be.a("Number");
    if (hasInflow) expect(result.transactions[0].Inflow).to.be.a("Number");
    if (hasOutflow) expect(result.transactions[0].Outflow).to.be.a("Number");
    expect(testPassed).to.equal(true);
  });
});
