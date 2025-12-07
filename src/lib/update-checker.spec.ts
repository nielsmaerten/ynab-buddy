import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  mock,
} from "bun:test";
import type { Mock } from "bun:test";
import { checkForUpdate } from "./update-checker";

// Mock fetch globally
global.fetch = mock();
const fetchMock = global.fetch as Mock;

describe("checkForUpdate", () => {
  beforeEach(() => {
    mock.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return updateAvailable: true when a newer version is available", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.1.0" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.1.0" }),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "2.1.0",
    });
  });

  it("should return updateAvailable: false when current version is latest", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.0.5" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.0.5" }),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: false,
      latest: "2.0.5",
    });
  });

  it("should return updateAvailable: false when current version is newer", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.0.0" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.0.0" }),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: false,
      latest: "2.0.0",
    });
  });

  it("should handle versions with 'v' prefix in current version", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.1.0" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.1.0" }),
      });

    const promise = checkForUpdate("v2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "2.1.0",
    });
  });

  it("should return null when fetch fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error"));

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should return null when API returns non-ok response", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should return null when release has no tag_name", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should return null when package.json fetch fails", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.0.5" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should return null when package.json has no version field", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.0.5" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should compare major version correctly", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v3.0.0" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "3.0.0" }),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "3.0.0",
    });
  });

  it("should compare minor version correctly", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.1.0" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.1.0" }),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "2.1.0",
    });
  });

  it("should compare patch version correctly", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.0.6" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.0.6" }),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "2.0.6",
    });
  });

  it("should handle pre-release versions by comparing base version only", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.0.5-beta" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.0.5-beta" }),
      });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: false,
      latest: "2.0.5-beta",
    });
  });

  it("should use correct GitHub API URL", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tag_name: "v2.0.5" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: "2.0.5" }),
      });

    const promise = checkForUpdate("2.0.5", "owner", "repo");
    jest.runAllTimers();
    await promise;

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.github.com/repos/owner/repo/releases/latest",
      expect.any(Object),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://raw.githubusercontent.com/owner/repo/v2.0.5/package.json",
      expect.any(Object),
    );
  });
});
