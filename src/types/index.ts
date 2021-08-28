export type Configuration = {
  importFolder: ImportFolder
  parsers: Parser[];
  bankFiles: BankFile[];
  ynab: {
    token: string;
    upload: boolean;
  };
  isFirstRun?: boolean;
};

export type ImportFolder = {
  exists: boolean;
  path: string;
}

export type BankFile = {
  pattern: string;
  parser: string;
  name: string;
};

export type Parser = {
  name: string;
  columns: string[];
  delimiter: string;
  dateFormat: string;
  footerRows: number;
  headerRows: number;
};
