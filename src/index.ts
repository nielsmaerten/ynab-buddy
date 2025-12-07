#!/usr/bin/env node
import fs from "fs";
import { messages } from "./constants";
import * as cli from "./lib/cli";
import { getConfiguration } from "./lib/configuration";
import { cleanup, exportCsv, findBankFiles } from "./lib/filesystem";
import { parseBankFile } from "./lib/parser";
import { upload } from "./lib/uploader";
import { BankFile } from "./types";

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
