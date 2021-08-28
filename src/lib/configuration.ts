import { exit } from "process";
import { Configuration } from "../types";
import { displayWelcomeMessage } from "./cli";

/**
 * // TODO
 * Reads configuration from the default config file.
 * If the file does not exist yet, it is created.
 * After configuring the user should remove the 'showConfigPrompt' line 
 * from the config file. If the line is still there and says 'true',
 * show the initial welcome message and exit the tool.
 */
export function getConfiguration(): Configuration {
  // TODO: read this from config file
  const config = {
    importPath: '',
    bankFilePatterns: [],
    ynab: {
      token: "ABC123",
      upload: true,
    },
    parsers: [],
    isFirstRun: false,
  };

  displayWelcomeMessage(config.isFirstRun);
  if (config.isFirstRun) exit();
  else return config;
}
