import { exit } from "process";
import { Configuration } from "../types";
import { displayWelcomeMessage } from "./cli";
import { homedir } from "os";
import { readFileSync, existsSync, copyFileSync } from "fs";
import { join as joinPaths } from "path";
import { CONFIG_FILENAME } from "../constants";

/**
 * // TODO
 * Reads configuration from the default config file.
 * If the file does not exist yet, it is created.
 * After configuring the user should remove the 'showConfigPrompt' line
 * from the config file. If the line is still there and says 'true',
 * show the initial welcome message and exit the tool.
 */
export function getConfiguration(): Configuration {
  // Verify the config file exists, otherwise create it
  const configFilePath = getConfigPath();
  const configFileExists = existsSync(configFilePath);
  if (!configFileExists) createConfigFile();

  // Read and parse the config file
  const cfg: Configuration = readConfigFile();


  // TODO: read this from config file
  const config = {
    importPath: "",
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

/**
 * Returns the full path to the config file: ~/ynab-buddy/config.yaml
 */
const getConfigPath = () => {
  return joinPaths(homedir(), CONFIG_FILENAME);
};

/**
 * Writes the default config file to the default location
 */
const createConfigFile = () => {
  return copyFileSync("../config/ynab-buddy.yaml", getConfigPath());
}

/**
 * Reads the config file from its default location
 */
const readConfigFile = () => {
  const buffer = readFileSync(getConfigPath());
  const yamlText = buffer.toString();
}