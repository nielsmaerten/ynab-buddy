export type Configuration = {
  importPath?: string;
  parsers: Parser[];
  bankFilePatterns: BankFilePattern[];
  ynab: {
    token: string;
    upload: boolean;
  };
  initializationDone: boolean;
};

export type BankFilePattern = {
  account_name: string;
  pattern: string;
  parser: string;
  ynab_account_id: string;
  ynab_budget_id: string;
  ynab_flag_color: string;
  upload: boolean;
  save_parsed_file: boolean;
  delete_original_file: boolean;
};

export type BankFile = {
  // TODO: decide types
  path: string;
  parser: string;
};

export type Parser = {
  name: string;
  columns: string[];
  delimiter: string;
  date_format: string;
  footer_rows: number;
  header_rows: number;
};
