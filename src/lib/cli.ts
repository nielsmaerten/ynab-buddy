import fs from "fs";
import chalk from "chalk";
import prompts from "prompts";
import "abort-controller/polyfill";
import { APP_NAME, APP_VERSION, messages } from "../constants";
import { getConfigPaths } from "./configuration";
import { checkForUpdate } from "./update-checker";

// Detect whether we're running as a packaged/bundled binary (pkg or bun --compile)
const isBundledBinary =
  Boolean((process as any).pkg) || process.env.YNAB_BUNDLED === "true";
const isNpmApp = !isBundledBinary;

export function displayWelcomeMessage(isFirstRun: boolean) {
  const appLabel = `${APP_NAME} (v${APP_VERSION})`;
  const border = new Array(appLabel.length).fill("*").join("");
  const configPath = getConfigPaths().fullPath;

  console.log("");
  console.log(border);
  console.log(appLabel);
  console.log(border);

  if (isFirstRun) {
    console.log(chalk.dim(messages.intro));
    console.log(chalk.blueBright(messages.disclaimer));
    console.log("");
    console.log(chalk.yellow(messages.notConfigured));
    console.log(chalk.yellow(messages.gettingStarted));
    console.log(chalk.dim(configPath));
  } else {
    console.log(chalk.blueBright(messages.usingConfigPath));
    console.log(configPath);
  }
  console.log("");
}

export function displayGoodbyeMessage() {
  console.log("");
  console.log(chalk.yellow(messages.goodbye));
  console.log("");
  console.log(messages.sponsor);
  console.log(chalk.blue(messages.sponsorLink));
  console.log("");
  console.log(messages.githubStar);
  console.log(chalk.blue(messages.githubLink));
  console.log("");
}

export async function exitApp() {
  // Print update notice if this is not the latest version
  await checkUpdate(APP_VERSION);

  // If the app was installed via NPM, exit immediately
  // This will return control to the terminal
  if (isNpmApp) process.exit();

  // Otherwise, wait for user to "press any key",
  // then exiting will close the window
  console.log(messages.exit);
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
  if (response.path === undefined) return exitApp();
  return response.path;
}

export async function checkUpdate(thisVersion: string) {
  try {
    const result = await checkForUpdate(
      thisVersion,
      "nielsmaerten",
      "ynab-buddy",
      3000,
    );

    if (result && result.updateAvailable) {
      const { notice, npmCommand, releaseUrl } = messages.newVersion;
      const whereToDownload = isNpmApp ? npmCommand : releaseUrl;
      console.log(notice, whereToDownload);
      console.log(messages.yourVersion, thisVersion);
      console.log(messages.latestVersion, result.latest);
    }
  } catch {
    // Ignore update check errors
  }
}
