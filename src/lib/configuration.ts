import { exit } from "process";
import { Configuration } from "../types";
import { displayWelcomeMessage } from "./cli";
import { readFileSync, existsSync, copyFileSync } from "fs";
import { resolve } from "path";
import { CONFIG_PATH } from "../constants";
import { load } from "js-yaml";
import { homedir } from "os";

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
  return {} as Configuration;

  // Read and parse the config file
  const cfg: Configuration = readConfigFile();

  // TODO: read this from config file
  const config: Configuration = {
    importPath: "",
    bankFilePatterns: [],
    ynab: {
      token: "ABC123",
      upload: true,
    },
    parsers: [],
    initializationDone: false,
  };

  displayWelcomeMessage(config.initializationDone);
  if (config.initializationDone) exit();
  else return config;
}

/**
 * Returns the full path to the config file: ~/ynab-buddy/config.yaml
 */
const getConfigPath = () => {
  return resolve(CONFIG_PATH.replace("~", homedir()));
};

/**
 * Writes the default config file to the default location
 */
const createConfigFile = () => {
  const defaultConfigFilePath = resolve("./src/config/ynab-buddy.yaml");
  const dest = getConfigPath();
  return copyFileSync(defaultConfigFilePath, dest);
};

/**
 * Reads the config file from its default location
 */
const readConfigFile = (): Configuration => {
  const buffer = readFileSync(getConfigPath());
  const yamlText = buffer.toString();
  const rawConfig = load(yamlText);

  throw "not implemented";
};
