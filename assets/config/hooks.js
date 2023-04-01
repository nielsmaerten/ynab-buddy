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

module.exports = {
  onCsvLoaded,
  onParseOptionsLoaded,
  onRecordsParsed,
  onTransactionsParsed,
  onConfigurationLoaded,
  onBankFilesFound,
};
