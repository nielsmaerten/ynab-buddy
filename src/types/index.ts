export type Configuration = {
  importPath?: string,
  parsers: Parser[];
  bankFiles: BankFile[];
  ynab: {
    token: string;
    upload: boolean;
  };
  isFirstRun?: boolean;
};

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
