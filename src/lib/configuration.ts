import fs from "fs";
import path from "path";
import chalk from "chalk";
import { homedir } from "os";
import { load } from "js-yaml";
import { Configuration } from "../types";
import {
  CONFIG_DIR,
  CONFIG_FILE,
  CONFIG_FILE_EXAMPLE,
  messages,
} from "../constants";

/**
 * Reads configuration from the default config file.
 * If the file does not exist yet, it is created.
 * After configuring the user should remove the 'showConfigPrompt' line
 * from the config file. If the line is still there and says 'true',
 * initializationDone will be false
 */
export function getConfiguration(): Configuration {
  // Verify the config file exists, otherwise create it
  const configFilePath = getConfigPaths().fullPath;
  const configFileExists = fs.existsSync(configFilePath);
  if (!configFileExists) createConfigFile();

  try {
    // Read and parse the config file
    const rawConfig = readConfigFile();
    const config = parseRawConfig(rawConfig);
    return config;
  } catch (err) {
    const msg = chalk.redBright(messages.invalidConfig.join("\n"));
    console.error(msg, configFilePath);
    console.error(chalk.redBright("Details:", err));
    throw "CONFIG ERROR";
  }
}

/**
 * Returns the full path to the config file: ~/ynab-buddy/config.yaml
 */
export const getConfigPaths = () => {
  const dir = path.resolve(CONFIG_DIR.replace("~", homedir()));
  const fileName = CONFIG_FILE;
  const fullPath = path.join(dir, fileName);
  const example = path.join(__dirname, "../../", CONFIG_FILE_EXAMPLE);
  return {
    example,
    fullPath,
    dir,
    fileName,
  };
};

/**
 * Writes an example config file to the default location
 */
const createConfigFile = () => {
  const { fullPath, dir, example } = getConfigPaths();

  // Ensure the config directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write example config file to destination
  const content = fs.readFileSync(example);
  const writeOpts = { flag: "w" };
  fs.writeFileSync(fullPath, content, writeOpts);
};

/**
 * Reads the config file from its default location
 */
const readConfigFile = () => {
  const configFile = getConfigPaths().fullPath;
  const buffer = fs.readFileSync(configFile);
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
    configurationDone: rawConfig.configuration_done !== false,
  };
};
