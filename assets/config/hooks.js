/**
 * ynab-buddy hooks
 * ================
 * Welcome to the hooks file!
 * Using the functions below, you can modify csv-data, configuration, 
 * and transactions as they are being processed.
 *
 * === BIG BEAUTIFUL DISCLAIMER
 * ==  Keep in mind that this is an advanced feature, and you can break things if you're not careful.
 * ==  If you're not sure what you're doing, you should probably leave this file alone.
 * ==  Be especially careful when pasting in code from the internet: do not blindly trust code you don't understand.
 * ==  The code running here will have full access to your computer, your transactions, and your YNAB account.
 * === BIG BEAUTIFUL DISCLAIMER
 * 
 * HOW IT WORKS:
 * 
 * Now that we got the disclaimer out of the way, let's see how hooks actually work:
 * As ynab-buddy is processing your bank's files, it will call the functions below at certain points in the process.
 * Each function has a bit more explanation in the comments above it.
 * By default, these functions don't modify anything, and just return the data they were given.
 */

/**
 * Called after loading ynab-buddy configuration. AKA: the 'config.yaml' file in this folder.
 */
function onConfigurationLoaded(config) {
  console.log(config);
  return config;
}

/**
 * Called when the contents of a CSV file has just been loaded, but before it has been parsed.
 * Example input:
 * "Date,Payee,Category,Memo,Outflow,Inflow\n1/1/2020,Payee 1,Category 1,Memo 1,10.00,\n1/2/2020,Payee 2,Category 2,Memo 2,,20.00\n"
 */
function onCsvLoaded(csv) {
  console.log(csv);
  return csv;
}

/**
 * Called when the CSV parse options have been loaded, but before they have been applied to the CSV data.
 * For more information on the parse options, see https://csv.js.org/parse/options/
 */
function onParseOptionsLoaded(options) {
  console.log(options);
  return options;
}

/**
 * Called for every record in the CSV file, after it has been parsed, but before it has been converted to a transaction.
 * To skip the record, return null.
 * For more information, see https://csv.js.org/parse/options/on_record/
 * Example input:
 * {
 *  Date: '1/1/2020',
 *  Payee: 'Payee 1',
 *  Amount: 10,
 *  Memo: 'Memo 1',
 *  Other_column: 'Other value',
 * }
 */
function onRecord(record) {
  console.log(record);
  return record;
}

/**
 * Called for every CSV file that is detected as a bank statement, but before it has been parsed.
 * To skip the file, return null.
 * Example input:
 * {
 * path: 'C:\\Users\\User\\Downloads\\bank-statement.csv',
 * }
 */
function onBankFile(bankFile) {
  console.log(bankFile);
  return bankFile;
}

/**
 * Called for every transaction that is created from a CSV record, but before it has been saved to YNAB.
 * The object returned should be a valid transaction object, as described here: https://api.youneedabudget.com/v1#/Transactions/createTransaction
 * To skip the transaction, return null.
 * Example input:
 *
 * transaction: {
 * date: '2020-01-01',
 * payee_name: 'Payee 1',
 * amount: 1000,
 * memo: 'Memo 1',
 * ...
 * }
 *
 * record: {
 *  .. same as onRecord
 * }
 */
function onTransaction(record, transaction) {
  console.log(transaction);
  return transaction;
}

module.exports = {
  onCsvLoaded,
  onParseOptionsLoaded,
  onConfigurationLoaded,
  onRecord,
  onBankFile,
  onTransaction,
};
