const chai = require("chai");
const assert = chai.assert;
const testData = require("./test-data");
const proxyquire = require("proxyquire");
const parseCsv = require("../src/parse-csv");
const sinon = require("sinon");

const test = {
  filename: testData.valid.filename,
  csv: testData.valid.csvString,
  ynab: {
    fakeToken: "this-is-fake",
    fakeAccountId: "abc123",
    fakeBudgetId: "xyz321"
  }
};

describe("uploadResult()", () => {
  it("imports a parseResult object into a YNAB Budget", async () => {
    let result = parseCsv(test.csv, test.filename);
    let ynabToken = test.ynab.fakeToken;
    let budgetId = test.ynab.fakeBudgetId;
    let accountId = test.ynab.fakeAccountId;

    await uploadResult(result.transactions, ynabToken, budgetId, accountId);
    assert(stub_ynab_createTransactions.callCount === 1);
  });
});

const stub_ynab_createTransactions = sinon.stub();

const stub_ynab = {
  API: class {
    constructor() {
      return {
        transactions: {
          createTransactions: stub_ynab_createTransactions
        }
      };
    }
  }
};

const uploadResult = proxyquire("../src/upload-result", {
  // Stub require("ynab") with stub_ynab. 
  // Comment this line out if you want to test against the real YNAB API
  ynab: stub_ynab
});
