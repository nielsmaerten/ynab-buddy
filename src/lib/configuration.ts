import fs from "fs";
import path from "path";
import { homedir } from "os";
import { load } from "js-yaml";
import { Configuration } from "../types";
import { CONFIG_DIR, CONFIG_FILE } from "../constants";

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
  const configFileExists = fs.existsSync(configFilePath);
  if (!configFileExists) createConfigFile();

  // Read and parse the config file
  const rawConfig = readConfigFile();
  const config = parseRawConfig(rawConfig);

  return config;
}

/**
 * Returns the full path to the config file: ~/ynab-buddy/config.yaml
 */
export const getConfigPath = () => {
  const dir = path.resolve(CONFIG_DIR.replace("~", homedir()));
  const file = CONFIG_FILE;
  return path.join(dir, file);
};

/**
 * Writes the default config file to the default location
 */
const createConfigFile = () => {
  const defaultConfigFilePath = path.resolve("./src/config/example.yaml");
  const dest = getConfigPath();
  const destDir = path.join(dest, "../");
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  return fs.copyFileSync(defaultConfigFilePath, dest);
};

/**
 * Reads the config file from its default location
 */
const readConfigFile = () => {
  const buffer = fs.readFileSync(getConfigPath());
  const yamlText = buffer.toString();
  const rawConfig = load(yamlText);
  return rawConfig;
};

const parseRawConfig = (rawConfig: any): Configuration => {
  return {
    importPath: rawConfig.import_from,
    searchSubDirectories: !!rawConfig.search_subdirectories,
    bankFilePatterns: rawConfig.bank_transaction_files,
    ynab: {
      token: rawConfig.upload_to_ynab.ynab_token,
      upload: rawConfig.upload_to_ynab.upload_transactions,
    },
    parsers: rawConfig.parsers,
    initializationDone: !rawConfig.show_config_prompt,
  };
};
