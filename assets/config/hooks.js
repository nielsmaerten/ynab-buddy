function onConfigurationLoaded(config) {
  return config;
}

function onBankFile(bankFile) {
  return bankFile;
}

function onCsvLoaded(csv) {
  return csv;
}

function onParseOptionsLoaded(options) {
  return options;
}

function onRecord(record) {
  return record;
}

function onTransaction(transaction, record) {
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
