import { Configuration } from "../types";
import { readFileSync, existsSync, copyFileSync } from "fs";
import { resolve } from "path";
import { CONFIG_PATH } from "../constants";
import { load } from "js-yaml";
import { homedir } from "os";

/**
 * Reads configuration from the default config file.
 * If the file does not exist yet, it is created.
 * After configuring the user should remove the 'showConfigPrompt' line
 * from the config file. If the line is still there and says 'true',
 * initializationDone will be false
 */
export function getConfiguration(): Configuration {
  // Verify the config file exists, otherwise create it
  const configFilePath = getConfigPath();
  const configFileExists = existsSync(configFilePath);
  if (!configFileExists) createConfigFile();

  // Read and parse the config file
  const rawConfig = readConfigFile();
  const config = parseRawConfig(rawConfig);

  return config;
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
const readConfigFile = () => {
  const buffer = readFileSync(getConfigPath());
  const yamlText = buffer.toString();
  const rawConfig = load(yamlText);
  return rawConfig;
};

const parseRawConfig = (rawConfig: any): Configuration => {
  return {
    importPath: rawConfig.import_from,
    bankFilePatterns: rawConfig.bank_transaction_files,
    ynab: {
      token: rawConfig.upload_to_ynab.ynab_token,
      upload: rawConfig.upload_to_ynab.upload_transactions,
    },
    parsers: rawConfig.parsers,
    initializationDone: !rawConfig.show_config_prompt,
  };
};
