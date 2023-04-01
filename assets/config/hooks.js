function onBankFilesFound(bankFiles) {
  console.log(bankFiles);
  return bankFiles;
}

function onCsvLoaded(csv) {
  console.log(csv);
  return csv;
}

function onParseOptionsLoaded(options) {
  console.log(options);
  return options;
}

function onConfigurationLoaded(config) {
  console.log(config);
  return config;
}

function onRecord(record) {
  console.log(record);
  return record;
}

function onBankFile(bankFile) {
  console.log(bankFile);
  return bankFile;
}

function onTransaction(record, transaction) {
  console.log(transaction);
  return transaction;
}

module.exports = {
  onCsvLoaded,
  onParseOptionsLoaded,
  onConfigurationLoaded,
  onBankFilesFound,
  onRecord,
  onBankFile,
  onTransaction,
};
