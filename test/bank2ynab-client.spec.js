const chai = require("chai");
const expect = chai.expect;
const client = require("../src/bank2ynab");

describe("bank2ynab client", () => {
  it("can read config", () => {
    let configs = client.getConfigs();
    configs.forEach(config => {
      expect(config.inputColumns.length).to.be.at.least(1);
    });
  });
});
