import fs from "fs";

const externalHooks = (() => {
  // When debugging, we want to load the hooks file from the project root
  const environment = process.env.NODE_ENV || "production";
  const isDev = ["development", "test"].includes(environment);
  if (isDev) return require(`${__dirname}/../../assets/config/hooks.js`);

  // Otherwise, load the hooks file from the user's home directory
  const userHomeDir = require("os").homedir();
  const hooksPath = `${userHomeDir}/ynab-buddy/hooks.js`;
  if (fs.existsSync(hooksPath)) {
    return require(hooksPath);
  }
  return null;
})();

export const onCsvLoaded = (csv: string) => {
  if (externalHooks && externalHooks.onCsvLoaded) {
    return externalHooks.onCsvLoaded(csv);
  }
  return csv;
};

export const onParseOptionsLoaded = (parseOptions: any) => {
  if (externalHooks && externalHooks.onParseOptionsLoaded) {
    return externalHooks.onParseOptionsLoaded(parseOptions);
  }
  return parseOptions;
};

export const onRecord = (record: any) => {
  if (externalHooks && externalHooks.onRecord) {
    return externalHooks.onRecord(record);
  }
  return record;
};

export const onTransaction = (record: any, tx: any) => {
  if (externalHooks && externalHooks.onTransaction) {
    return externalHooks.onTransaction(record, tx);
  }
  return tx;
};

export const onConfigurationLoaded = (config: any) => {
  if (externalHooks && externalHooks.onConfigurationLoaded) {
    return externalHooks.onConfigurationLoaded(config);
  }
  return config;
};

export const onBankFilesFound = (bankFiles: any) => {
  if (externalHooks && externalHooks.onBankFilesFound) {
    return externalHooks.onBankFilesFound(bankFiles);
  }
  return bankFiles;
};
