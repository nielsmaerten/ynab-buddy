import { exit } from "process";
import { messages } from "./constants";
import { confirmImportPath, displayWelcomeMessage } from "./lib/cli";
import { getConfiguration } from "./lib/configuration";
import { exportCsv, findBankFiles, cleanup } from "./lib/filesystem";
import { parseBankFile } from "./lib/parser";
import { upload } from "./lib/uploader";
import { BankFile } from "./types";

(async () => {
  // Ensure the tool has a valid configuration
  const config = getConfiguration();

  // Display welcome message, exit if initialization has not yet been completed
  displayWelcomeMessage({ isFirstRun: !config.configurationDone });
  if (!config.configurationDone) exit();

  // Confirm folder where the tool should look for bank files
  config.importPath = await confirmImportPath(config.importPath);

  // Find files eligible for conversion in the importPath
  const bankFiles = findBankFiles(config.importPath!, config);
  console.log(messages.filesFound, bankFiles.length);

  // Parse and convert bankFiles
  const doParsing = (bf: BankFile) => parseBankFile(bf, config.parsers);
  const parsedFiles = bankFiles.map(doParsing);

  // Save parsed files, delete original files
  parsedFiles.forEach(exportCsv);
  parsedFiles.forEach(cleanup);
  parsedFiles.forEach((parsedFile) => upload(parsedFile, config));

  console.log("All done.");

  // PSEUDOCODE

  // if (config.ynab.uploadTransactions !== false) {
  //   for (let i = 0; i < parsedFiles.length; i++) {
  //     const parsedFile = parsedFiles[i];
  //     if (parsedFile.autoUpload) {
  //       // Uploading 123 transactions from "csvfile1.csv" to YNAB
  //       // Uploading 23 transactions from "csvfile2.csv" to YNAB
  //       uploadTransactions(parsedFile, config);
  //       parsedFile.uploaded = true;
  //     }
  //   }
  // }

  // displayGoodbyeMessage();
  // // All done! Check your YNAB budget to approve the newly imported transactions
  // // Did ynab buddy just save you some time? Then maybe consider buying me a coffee :)
  // // https://ko-fi/...
})().catch((err) => {
  console.error("Unhandled error: exiting.");
  process.exit();
});
