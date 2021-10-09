export const CONFIG_DIR = "~/ynab-buddy";
export const CONFIG_FILE = "config.yaml";
export const CONFIG_FILE_EXAMPLE = "assets/config/example.yaml";
export const TEST_BANKS_DIR = "assets/test-banks";
export const APP_NAME = "YNAB Buddy";
export const APP_VERSION = require("../package.json").version;
export const UPDATE_CHECK_URL = "https://api.niels.me/ynab-buddy/package.json";

export const messages = {
  disclaimer:
    "Disclaimer: This is a community project, not an official service from YNAB.",
  intro: "Convert CSV files from any bank; upload directly to YNAB",
  notConfigured: "Looks like YNAB Buddy is not yet configured.",
  gettingStarted:
    "To get started, open the following file and follow the instructions:",
  usingConfigPath: "Using configuration file:",
  invalidConfig: [
    "%s is not a valid config file.",
    "To get a fresh config file, delete it and run this tool again.",
  ],
  importFolderPrompt: "Where are your bank's files located?",
  folderNotFound: "Could not find folder:",
  filesFound: "Found %s file(s) eligible for parsing.",
  parsingDone: "Success: %s transactions parsed.",
  parsing: "Parsing: %s",
  parseDateError: [
    "Unable to parse '%s'.",
    "The expected date format was: '%s'.",
    "You may want to check the format in your config.yaml file.",
  ],
  uploadError: [
    "Error while uploading transactions to YNAB.",
    "Ensure your config file has a valid token, budgetID and accountID",
    "Error detail: %s",
  ],
  uploadSuccess: "Success: %s transactions uploaded to YNAB.",
  goodbye:
    "🎉 All done! Open YNAB to categorize your newly imported transactions.",
  sponsor:
    "Did this tool just save you some time? Then maybe consider buying me a coffee:",
  sponsorLink: "https://go.niels.me/coffee",
  exit: "Press any key to exit",
  newVersion: {
    notice: "A newer version of ynab-buddy is available.",
    releaseUrl:
      "Download here: https://github.com/nielsmaerten/ynab-buddy/releases",
    npmCommand: "To upgrade, run 'npm install -g ynab-buddy'",
  },
};
