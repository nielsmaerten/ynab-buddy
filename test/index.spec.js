const Proxy = require("../src");
const chai = require("chai");
const expect = chai.expect;

describe("Proxy for YNAB", () => {
  it("exposes a CSV parser", () => {
    expect(Proxy.parser.csv).to.be.a("function");
  });

  it("exposes a file parser", () => {
    expect(Proxy.parser.file).to.be.a("function");
  });

  it("exposes a 'saveResult' function", () => {
    expect(Proxy.saveResult).to.be.a("function");
  });

  it("exposes a 'uploadResult' function", () => {
    expect(Proxy.uploadResult).to.be.a("function");
  });
});
