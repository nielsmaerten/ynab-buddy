import { existsSync } from "fs";
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
  }
}

/**
 * // TODO: Next steps: get the import path using 'inquirer'
 * - it will need to be validated, and the promise should only resolve with a valid path
 * - the default path can be selected by just pressing enter
 * - if it the path is invalid or does not exist, we ask again
 * - no need to validate defaultpath upfront, just allow user to press enter and fail from there
 *
 * Asks the user to confirm the folder where the tool should search for BankFiles.
 * If a default folder has been set in config the user can confirm by pressing ENTER,
 * or provide a new path. If no default is set, we use the current working directory
 * The function loops until a valid existing path is provided
 */
export async function confirmImportPath(defaultPath: string | undefined) {
  const response = await prompts({
    type: "text",
    name: "path",
    initial: defaultPath,
    message: "Directory containing files to import/convert",
    validate: (value) => {
      return existsSync(value);
    },
  });
  console.log("Proceeding with import path:", response.path);
  return response.path;
}
