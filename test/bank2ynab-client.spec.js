const chai = require("chai");
const expect = chai.expect;
const client = require("../src/bank2ynab-client");

describe("bank2ynab client", () => {
  it("can read config", () => {
    let configs = client.getBank2YnabConfig();
    configs.forEach(config => {
      expect(config.inputColumns.length).to.be.at.least(1);
    });
  });
});
