import fs from "fs";
import chalk from "chalk";
import prompts from "prompts";
import { APP_NAME, APP_VERSION, messages } from "../constants";
import { getConfigPath } from "./configuration";
import { exit } from "process";

export function displayWelcomeMessage({ isFirstRun }: { isFirstRun: boolean }) {
  const appLabel = `${APP_NAME} (v${APP_VERSION})`;
  const border = new Array(appLabel.length).fill("*").join("");

  console.log("");
  console.log(border);
  console.log(appLabel);
  console.log(border);

  if (isFirstRun) {
    console.log(chalk.dim(messages.intro));
    console.log(chalk.yellow(messages.notConfigured));
    console.log(chalk.yellow(messages.gettingStarted));
    console.log(chalk.dim(getConfigPath()));
  } else {
    console.log(chalk.blueBright(messages.usingConfigPath));
    console.log(getConfigPath());
  }
  console.log("");
}

export function displayGoodbyeMessage() {
  console.log("");
  console.log(chalk.yellow(messages.goodbye));
  console.log("");
  console.log(messages.sponsor);
  console.log(chalk.bgBlueBright(messages.sponsorLink));
  console.log("");
  console.log(messages.exit);

  // Next keypress exits the app
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
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
  if (response.path === undefined) exit();
  return response.path;
}
