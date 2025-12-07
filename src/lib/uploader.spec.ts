import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import * as fixture from "./uploader.spec.fixtures";

mock.restore();

describe("uploader", () => {
  let uploader: typeof import("./uploader");
  let sendToYnab: ReturnType<typeof spyOn>;

  beforeAll(() => {
    delete require.cache[require.resolve("./uploader")];
    uploader = require("./uploader");
    sendToYnab = spyOn(uploader, "sendToYnab");
  });
  beforeEach(() => {
    sendToYnab.mockReset();
  });
  afterAll(() => {
    sendToYnab.mockRestore();
  });

  it("sends transactions to YNAB", () => {
    uploader.upload(fixture.parsedBankFile, fixture.config);

    expect(sendToYnab).toHaveBeenCalled();
    const transactions = sendToYnab.mock.calls[0][0];
    expect(transactions).toEqual(fixture.expectedTransactions);
  });

  it("skips sending transactions to YNAB if no transactions are parsed.", () => {
    uploader.upload(fixture.emptyTransactionsParsedBankFile, fixture.config);
    expect(sendToYnab).not.toHaveBeenCalled();
  });
});
