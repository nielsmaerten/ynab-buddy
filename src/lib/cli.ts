import fs from "fs";
import chalk from "chalk";
import prompts from "prompts";
import { APP_NAME, APP_VERSION, messages } from "../constants";
import { getConfigPath } from "./configuration";

export function displayWelcomeMessage({ isFirstRun }: { isFirstRun: boolean }) {
  const appVersion = chalk.bold.inverse(`${APP_NAME} [v${APP_VERSION}]\n`);
  console.log(appVersion);
  if (isFirstRun) {
    console.log(chalk.blue(messages.intro));
    console.log(
      chalk.yellow(messages.notConfigured),
      chalk.green(messages.gettingStarted),
      chalk.green(getConfigPath())
    );
  } else {
    console.log(messages.usingConfigPath, getConfigPath());
  }
}

/**
 * Asks the user to confirm the folder where the tool should search for BankFiles.
 * If a default folder has been set in config the user can confirm by pressing ENTER,
 * or provide a new path. If no default is set, we use the current working directory
 * The function loops until a valid existing path is provided
 */
export async function confirmImportPath(defaultPath: string | undefined) {
  const initialPath = defaultPath || process.cwd();
  const response = await prompts({
    type: "text",
    name: "path",
    initial: initialPath,
    message: messages.importFolderPrompt,
    validate: (value) => {
      const valid = fs.existsSync(value);
      if (!valid) return `${messages.folderNotFound} ${value}`;
      return valid;
    },
  });
  return response.path;
}
