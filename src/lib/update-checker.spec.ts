import { checkForUpdate } from "./update-checker";

// Mock fetch globally
global.fetch = jest.fn();

describe("checkForUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return updateAvailable: true when a newer version is available", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.1.0" }),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "v2.1.0",
    });
  });

  it("should return updateAvailable: false when current version is latest", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.0.5" }),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: false,
      latest: "v2.0.5",
    });
  });

  it("should return updateAvailable: false when current version is newer", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.0.0" }),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: false,
      latest: "v2.0.0",
    });
  });

  it("should handle versions with 'v' prefix in current version", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.1.0" }),
    });

    const promise = checkForUpdate("v2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "v2.1.0",
    });
  });

  it("should return null when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should return null when API returns non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should return null when release has no tag_name", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBeNull();
  });

  it("should compare major version correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v3.0.0" }),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "v3.0.0",
    });
  });

  it("should compare minor version correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.1.0" }),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "v2.1.0",
    });
  });

  it("should compare patch version correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.0.6" }),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: true,
      latest: "v2.0.6",
    });
  });

  it("should handle pre-release versions by comparing base version only", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.0.5-beta" }),
    });

    const promise = checkForUpdate("2.0.5", "nielsmaerten", "ynab-buddy");
    jest.runAllTimers();
    const result = await promise;

    expect(result).toEqual({
      updateAvailable: false,
      latest: "v2.0.5-beta",
    });
  });

  it("should use correct GitHub API URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tag_name: "v2.0.5" }),
    });

    const promise = checkForUpdate("2.0.5", "owner", "repo");
    jest.runAllTimers();
    await promise;

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/owner/repo/releases/latest",
      expect.any(Object),
    );
  });
});
