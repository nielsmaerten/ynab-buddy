#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { messages } from "./constants";
import * as cli from "./lib/cli";
import { getConfiguration } from "./lib/configuration";
import { cleanup, exportCsv, findBankFiles } from "./lib/filesystem";
import { parseBankFile } from "./lib/parser";
import { upload } from "./lib/uploader";
import { BankFile } from "./types";
import { EMBEDDED_HOOKS } from "./lib/embedded-assets";
import { USER_HOOKS_PATH } from "./lib/hooks-loader";

type AppDeps = {
  getConfiguration: typeof getConfiguration;
  displayWelcomeMessage: typeof cli.displayWelcomeMessage;
  displayGoodbyeMessage: typeof cli.displayGoodbyeMessage;
  confirmImportPath: typeof cli.confirmImportPath;
  exitApp: typeof cli.exitApp;
  findBankFiles: typeof findBankFiles;
  parseBankFile: typeof parseBankFile;
  exportCsv: typeof exportCsv;
  cleanup: typeof cleanup;
  upload: typeof upload;
};

const defaultDeps: AppDeps = {
  getConfiguration,
  displayWelcomeMessage: cli.displayWelcomeMessage,
  displayGoodbyeMessage: cli.displayGoodbyeMessage,
  confirmImportPath: cli.confirmImportPath,
  exitApp: cli.exitApp,
  findBankFiles,
  parseBankFile,
  exportCsv,
  cleanup,
  upload,
};

export async function runApp(overrides: Partial<AppDeps> = {}) {
  const deps = { ...defaultDeps, ...overrides };
  const {
    getConfiguration,
    displayWelcomeMessage,
    displayGoodbyeMessage,
    confirmImportPath,
    exitApp,
    findBankFiles,
    parseBankFile,
    exportCsv,
    cleanup,
    upload,
  } = deps;

  // Ensure the tool has a valid configuration
  if (process.argv.includes("--setup-hooks")) {
    setupHooksFile();
    console.log("Hooks file written to:", USER_HOOKS_PATH);
    return;
  }

  const config = getConfiguration();

  // Exit if the config file is not set up yet
  const isFirstRun = !config.configurationDone;
  if (isFirstRun) {
    displayWelcomeMessage(isFirstRun);
    return exitApp();
  }

  // Display welcome message
  displayWelcomeMessage(isFirstRun);

  // Confirm folder where the tool should look for bank files
  const importPathExists =
    config.importPath && fs.existsSync(config.importPath);
  if (!config.skipPathConfirmation || !importPathExists) {
    config.importPath = await confirmImportPath(config.importPath);
  }

  // Find files eligible for conversion in the importPath
  const bankFiles = findBankFiles(config.importPath!, config);
  console.log(messages.filesFound, bankFiles.length);

  // Parse and convert bankFiles
  const doParsing = (bf: BankFile) => parseBankFile(bf, config.parsers);
  const parsedFiles = bankFiles.map(doParsing);

  // Save parsed files, delete original files
  parsedFiles.forEach(exportCsv);
  parsedFiles.forEach(cleanup);

  // Upload to YNAB
  console.log("");
  const uploads = parsedFiles.map((parsedFile) => upload(parsedFile, config));
  await Promise.all(uploads);

  // All done!
  displayGoodbyeMessage();
  return exitApp();
}

function handleError(
  err: any,
  exitApp: AppDeps["exitApp"] = defaultDeps.exitApp,
) {
  console.error("Unhandled error: exiting.");

  const isVerbose = process.argv.find((arg) => arg.toLowerCase() === "-v");
  if (isVerbose) console.error(JSON.stringify(err));
  else console.log("For details, run with flag `-v`");

  return exitApp();
}

if (process.env.YNAB_BUDDY_DISABLE_AUTO_RUN !== "true") {
  runApp().catch((err) => handleError(err));
}

function setupHooksFile() {
  const hooksDir = path.dirname(USER_HOOKS_PATH);
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }
  fs.writeFileSync(USER_HOOKS_PATH, EMBEDDED_HOOKS, { flag: "w" });
}
