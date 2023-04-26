/**
 * ynab-buddy Hooks
 * ================
 *
 * Welcome to the ynab-buddy hooks file!
 * This file allows you to customize the behavior of ynab-buddy while processing files by adding your own code.
 * You can modify CSV data, configuration, and transactions as they are being processed.
 *
 * === IMPORTANT DISCLAIMER ===
 * This is an advanced feature, and you can break things if you're not careful.
 * If you're not sure what you're doing, it's better to leave this file alone.
 * Be especially careful when pasting in code from the internet: do not blindly trust code you don't understand.
 * The code running here will have full access to your computer, your transactions, and your YNAB account.
 * === IMPORTANT DISCLAIMER ===
 *
 * HOW IT WORKS:
 *
 * As ynab-buddy processes your bank's files, it calls the functions below at certain points in the process.
 * Each function has a more detailed explanation in the comments above it.
 * By default, these functions don't modify any data and simply return the input they receive.
 *
 * HOW TO DEBUG:
 *
 * 1. We'll assume you're using VisualStudio Code.
 *    Run `yarn hooks` in a Javascript Debug Terminal. This terminal can be opened from the command palette (Ctrl+Shift+P) or (Cmd+Shift+P).
 *    This will run ynab-buddy using the config and hooks file found in the assets folder.
 *
 * 2. Paste your own configuration into the assets/config/example.yaml,
 *    and make sure the import path is pointing a few files you can test with.
 *
 * 3. Set breakpoints in your hooks where needed.
 *
 * 4. Once you're happy with your code, copy your hooks file into the ynab-buddy folder in your home directory.
 */

// 1. Called after loading ynab-buddy configuration (config.yaml file in this folder)
// config: Object containing the configuration data from the config.yaml file
function onConfigurationLoaded(config) {
  // You can modify the configuration here if necessary
  console.log(config);
  return config;
}

// 2. Called for every CSV file that is detected as a bank statement, but before it has been parsed
// bankFile: Object containing the path of the detected CSV file
// {
//   path: 'C:\\Users\\User\\Downloads\\bank-statement.csv',
// }
function onBankFile(bankFile) {
  // To skip processing the file, return null
  console.log(bankFile);
  return bankFile;
}

// 3. Called when the contents of a CSV file have been loaded, but before they have been parsed
// csv: String containing the raw content of the CSV file
function onCsvLoaded(csv) {
  // You can modify the CSV data here if necessary
  console.log(csv);
  return csv;
}

// 4. Called when the CSV parse options have been loaded, but before they have been applied to the CSV data
// options: Object containing the CSV parsing options from the config.yaml file
// For more information on the parse options, see https://csv.js.org/parse/options/
function onParseOptionsLoaded(options) {
  // You can modify the parse options here if necessary
  console.log(options);
  return options;
}

// 5. Called for every record in the CSV file, after it has been parsed, but before it has been converted to a transaction
// record: Object containing the parsed data for a single row in the CSV file
// {
//   Date: '1/1/2020',
//   Payee: 'Payee 1',
//   Amount: 10,
//   Memo: 'Memo 1',
//   Other_column: 'Other value',
// }
function onRecord(record) {
  // To skip the record, return null
  console.log(record);
  return record;
}

// 6. Called for every transaction created from a CSV record, but before it has been saved to YNAB
// record: Object containing the parsed data for a single row in the CSV file (same as onRecord)
// transaction: Object containing the transaction data formatted for YNAB's API
// See https://api.youneedabudget.com/v1#/Transactions/createTransaction for a valid transaction object
// {
//   date: '2020-01-01',
//   payee_name: 'Payee 1',
//   amount: 1000,
//   memo: 'Memo 1',
//   ...
// }
function onTransaction(transaction, record) {
  // To skip the transaction, return null
  // Ensure the returned object is a valid transaction object
  console.log(transaction);
  return transaction;
}

// Export all hook functions so they can be used by ynab-buddy
module.exports = {
  onConfigurationLoaded,
  onBankFile,
  onCsvLoaded,
  onParseOptionsLoaded,
  onRecord,
  onTransaction,
};
