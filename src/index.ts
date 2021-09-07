import { exit } from "process";
import { confirmImportPath, displayWelcomeMessage } from "./lib/cli";
import { getConfiguration } from "./lib/configuration";
import { findBankFiles } from "./lib/filesystem";
import { parseBankFile } from "./lib/parser";

(async () => {
  // Ensure the tool has a valid configuration
  const config = getConfiguration();

  // Display welcome message, exit if initialization has not yet been completed
  displayWelcomeMessage({isFirstRun: !config.initializationDone});
  if (config.initializationDone === false) exit();

  // Confirm folder where the tool should look for bank files
  config.importPath = await confirmImportPath(config.importPath);

  // Find files eligible for conversion in the importPath
  const bankFiles = findBankFiles(config.importPath!);

  // Parse and convert bankFiles
  const parsedFiles = bankFiles.map((bankFile) => {
    parseBankFile(bankFile);
  });

  // PSEUDOCODE
  // // Looking for csv files to convert in c:/users/downloads/ ...
  // // Found 5 files eligible for conversion
  // const bankFiles = findBankFiles(import.importFolder);
  // const parsedFiles = bankFiles.map((bankfile) =>
  //   // Parsing "csvfile1.csv" as "parsername"
  //   // Parsing "csvfile1.csv" as "parsername"
  //   // Parsing "csvfile1.csv" as "parsername"
  //   parseBankfile(bankfile, config)
  // );

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

  // // Saving converted files...
  // if (config.saveParsedFiles) {
  //   parsedFiles.forEach(saveParsedFile);
  // }
  // // Deleting imported files...
  // if (config.deleteOriginalFiles) {
  //   parsedFiles.forEach((parsedFile) => {
  //     if (parsedFile.uploaded || config.saveParsedFiles) {
  //       deleteOriginalFile(parsedFile);
  //     }
  //   });
  // }

  // displayGoodbyeMessage();
  // // All done! Check your YNAB budget to approve the newly imported transactions
  // // Did ynab buddy just save you some time? Then maybe consider buying me a coffee :)
  // // https://ko-fi/...
})();
