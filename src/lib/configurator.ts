import { Configuration } from "../types";

/**
 * Reads the configuration file from disk and returns it as a Configuration object
 * @returns A Configuration object with all settings required to run ynab-buddy
 */
export function getConfiguration(): Configuration | undefined {
  // TODO: read from file or return empty if file is not found
  return {
    importFolder: {
      path: "",
      exists: false,
    },
    bankFiles: [],
    ynab: {
      token: "ABC123",
      upload: true,
    },
    parsers: [],
    isFirstRun: undefined,
  };
}
