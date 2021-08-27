export type Configuration = {
  importFolder: {
    path: string;
    exists: boolean;
  };
  parsers: Parser[];
  bankFiles: BankFile[];
  ynab: {
    token: string;
    upload: boolean;
  };
  showConfigPrompt?: boolean;
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
