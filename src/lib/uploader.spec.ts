import * as fixture from './uploader.spec.fixtures';

describe.skip("uploader", () => {
  // Patch sendToYnab so we can spy on what the uploader spits out
  const uploader = require("./uploader");
  const mock_sendToYnab = jest.fn();
  const original_sendToYnab = uploader.sendToYnab;
  beforeAll(() => {
    uploader.sendToYnab = mock_sendToYnab;
  });
  beforeEach(() => {
    mock_sendToYnab.mockReset();
  });
  afterAll(() => {
    uploader.sendToYnab = original_sendToYnab;
  });

  it("adds an importId to every transaction", () => {
  });

  it("beams transactions to YNAB", () => {
    uploader.upload(fixture.parsedBankFile, fixture.config)
    expect(mock_sendToYnab).toHaveBeenCalled();
  });
});
