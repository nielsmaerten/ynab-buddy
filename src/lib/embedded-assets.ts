// Embedded copies of assets needed for compiled binaries.
// These are only used as a fallback when the on-disk assets are not available.

export const EMBEDDED_EXAMPLE_CONFIG = String.raw`import_from: "c:/users/test/downloads"
skip_path_confirmation: false
search_subdirectories: true
bank_transaction_files:
  - account_name: BNP Checking Account
    pattern: BNP-export-IBAN01233456789-*.csv
    parser: bnp-example-parser
    ynab_account_id: 00000000-0000-0000-0000-000000000000
    ynab_budget_id: 00000000-0000-0000-0000-000000000000
    ynab_flag_color: purple
    upload: true
    save_parsed_file: false
    delete_original_file: true
parsers:
  - name: bnp-example-parser
    header_rows: 2
    footer_rows: 0
    delimiter: ";"
    columns: [skip, skip, memo, date, skip, inflow, outflow, payee]
    date_format: M/d/yyyy
    decimal_separator: "."
    thousand_separator: ","
upload_to_ynab:
  upload_transactions: false
  ynab_token: ABC12345
configuration_done: false`;

// Template hooks file used when ejecting hooks for compiled binaries.
export const EMBEDDED_HOOKS = `function onConfigurationLoaded(config) {
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

function onTransaction(transaction) {
  return transaction;
}

module.exports = {
  onConfigurationLoaded,
  onBankFile,
  onCsvLoaded,
  onParseOptionsLoaded,
  onRecord,
  onTransaction,
};
`;
