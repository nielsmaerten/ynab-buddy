import { BankFile, BankFilePattern, Parser } from "../types";

const csv = `id,date,amount,memo,account
1,9/27/2020,871.13,Devpoint,IL95 2010 7730 7319 4618 209
2,11/26/2019,908.31,Realcube,GE78 WG91 9644 2111 5080 45
3,3/6/2020,152.13,Oyoloo,GR11 2705 328W VAZB OZUD NLWB DJT
4,7/7/2021,-944.04,Twitterbeat,TN09 4817 6131 9663 3637 8294
5,2/27/2021,68.18,Vinte,DE72 1181 1898 3239 8836 38`;

const parsers: Parser[] = [
  {
    columns: ["skip", "Date", "Amount", "Memo", "Payee"],
    date_format: "%m/%d/%Y",
    delimiter: ",",
    footer_rows: 0,
    header_rows: 1,
    name: "TEST",
  },
];

const bankFile: BankFile = {
  isBankFile: true,
  path: "not/a/real/path",
  matchedParser: "TEST",
  matchedPattern: { TEST: "TEST" } as any,
};

export default {
  csv,
  parsers,
  bankFile,
};
