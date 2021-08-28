import { exit } from "process";
import { displayWelcomeMessage, askImportFolder } from "./lib/cli";
import { getConfiguration } from "./lib/configurator";

// Display welcome message asking users to setup config if they haven't done so yet
const config = getConfiguration();
const isFirstRun = config?.isFirstRun === true;
displayWelcomeMessage(isFirstRun);
if (isFirstRun || !config) exit();

// If no default importFolder is set up, ask user to provide it now
if (!config.importFolder.exists) {
    config.importFolder = askImportFolder();
}

// if (config.importFolder.exists === false) {
//   // No default import folder set up. Where should ynab buddy look for your csv files?
//   // (press enter to search the current directory)
//   config.importFolder = promptImportFolder();
// }

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
