import * as fixture from "./uploader.spec.fixtures";

describe("uploader", () => {
  // Patch sendToYnab so we can spy on what the uploader spits out
  const uploader = require("./uploader");
  const original_sendToYnab = uploader.sendToYnab;
  beforeAll(() => {
    delete uploader.sendToYnab;
    uploader.sendToYnab = jest.fn();
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    uploader.sendToYnab = original_sendToYnab;
  });

  it("sends transactions to YNAB", () => {
    const sendToYnab = uploader.sendToYnab as jest.Mock;
    uploader.upload(fixture.parsedBankFile, fixture.config);

    expect(sendToYnab).toHaveBeenCalled();
    const transactions = sendToYnab.mock.calls[0][0];
    expect(transactions).toEqual(fixture.expectedTransactions);
  });

  it("skips sending transactions to YNAB if no transactions are parsed.", () => {
    const sendToYnab = uploader.sendToYnab as jest.Mock;
    uploader.upload(fixture.emptyTransactionsParsedBankFile, fixture.config);
    expect(sendToYnab).not.toHaveBeenCalled();
  });
});
