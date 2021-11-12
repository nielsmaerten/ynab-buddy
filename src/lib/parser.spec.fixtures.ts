import { BankFile, Parser } from "../types";

// IMPORTANT NOTE ON CSV FIXTURES FOR TESTING
// Every CSV must:
// - have amounts between [-1000;1000]
// - have dates between [1990-02-27;2021-09-09]
// - have exactly 3 valid transactions

export const csv = [
  // Semicolon delimited
  `1;9/27/2020;871.13;Devpoint;IL95 2010 7730 7319 4618 209
2;11/26/2019;908.31;Realcube;GE78 WG91 9644 2111 5080 45
3;3/6/2020;152.13;Oyoloo;GR11 2705 328W VAZB OZUD NLWB DJT`,

  // Header, footer and empty row
  `id,date,amount,memo,account
1,9/27/2020,871.13,Devpoint,IL95 2010 7730 7319 4618 209
2,11/26/2019,908.31,Realcube,GE78 WG91 9644 2111 5080 45

3,3/6/2020,152.13,Oyoloo,GR11 2705 328W VAZB OZUD NLWB DJT
invalid footer row
`,

  // Decimal comma
  `1;9/27/2020;871,13;Devpoint;IL95 2010 7730 7319 4618 209
2;11/26/2019;908,31;Realcube;GE78 WG91 9644 2111 5080 45
3;3/6/2020;152,13;Oyoloo;GR11 2705 328W VAZB OZUD NLWB DJT`,

  // Multiple memo columns
  `1;9/27/2020;871.13;memo A;memo B
2;11/26/2019;908.31;memo A;memo B
3;3/6/2020;152.13;memo A;memo B`,

  // Inflow/Outflow indicator in last column
  `1;9/27/2020;871.13;Devpoint;In
2;11/26/2019;908.31;Realcube;Out
3;3/6/2020;152.13;Oyoloo;In`,
];

export const defaultParser: Parser =
  // TODO: rename this to ParseCfg
  {
    columns: ["", "date", "amount", "memo", "payee"],
    date_format: "L/d/yyyy",
    delimiter: ";",
    footer_rows: 0,
    header_rows: 0,
    name: "TEST",
  };

export const bankFile: BankFile = {
  isBankFile: true,
  path: "not/a/real/path",
  matchedParser: "TEST",
  matchedPattern: { TEST: "TEST" } as any,
};
