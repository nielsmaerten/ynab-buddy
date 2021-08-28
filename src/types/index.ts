export type Configuration = {
  importPath?: string,
  parsers: Parser[];
  bankFilePatterns: BankFilePattern[];
  ynab: {
    token: string;
    upload: boolean;
  };
  isFirstRun?: boolean;
};

export type BankFilePattern = {
  pattern: string;
  parser: string;
  name: string;
};

export type BankFile = {
  // TODO: decide types
  path: string;
  parser: string;
}

export type Parser = {
  name: string;
  columns: string[];
  delimiter: string;
  dateFormat: string;
  footerRows: number;
  headerRows: number;
};
