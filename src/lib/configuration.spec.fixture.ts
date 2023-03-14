export const constants = {
  CONFIG_FILE_EXAMPLE: "/example/testExampleConfig.yaml",
  CONFIG_DIR: "/test/ynab-buddy",
  CONFIG_FILE: "testConfig.yaml",
  messages: {},
};

export const configFile = `#######################################
##   YNAB BUDDY CONFIGURATION FILE   ##
#######################################

# In this file, you'll teach ynab-buddy how to process
# files from your bank. To learn how to configure ynab-buddy, visit:
#
# https://github.com/nielsmaerten/ynab-buddy/blob/main/docs/how-to-configure.md

import_from: "c:/users/test/downloads"
search_subdirectories: true

bank_transaction_files:
  # Repeat the following block for every account:
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
    delimiter: ","
    columns: [skip, skip, memo, date, inflow, skip]
    date_format: M/d/yyyy

upload_to_ynab:
  # This is the default. If you've set the 'upload' option on
  # a bank_transaction_file, that one will take precedence.
  upload_transactions: false
  ynab_token: ABC12345

# When you're done configuring, delete the next line:
configuration_done: false
`;
