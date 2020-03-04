const buddy = require("../src");
const chai = require("chai");
const expect = chai.expect;

describe("ynab-buddy", () => {
  it("exposes a CSV parser", () => {
    expect(buddy.parser.csv).to.be.a("function");
  });

  it("exposes a file parser", () => {
    expect(buddy.parser.file).to.be.a("function");
  });

  it("exposes a 'saveResult' function", () => {
    expect(buddy.saveResult).to.be.a("function");
  });

  it("exposes a 'uploadResult' function", () => {
    expect(buddy.uploadResult).to.be.a("function");
  });
});
