export const CONFIG_DIR = "~/ynab-buddy";
export const CONFIG_FILE ="config.yaml";
export const CONFIG_FILE_EXAMPLE = "src/config/example.yaml";
export const APP_NAME = "YNAB Buddy";
export const APP_VERSION = require("../package.json").version;

export const messages = {
  intro:
    "This tool converts your bank's CSV files to YNAB-format and uploads them directly to your budget.",
  notConfigured: "It looks like YNAB Buddy is not yet configured.",
  gettingStarted:
    "To get started, open the following file and follow the instructions:",
  usingConfigPath: "Using configuration from:",
  importFolderPrompt: "Folder containing your bank's CSV files:",
  folderNotFound: "Could not find folder:"
};
