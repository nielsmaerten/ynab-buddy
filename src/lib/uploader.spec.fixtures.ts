import { Configuration, ParsedBankFile } from "../types";

export const config: Configuration = {
  ynab: {
    token: "testToken",
    upload: true,
  },
} as any;

export const parsedBankFile: ParsedBankFile = {
  source: {
    matchedPattern: {
      upload: true,
      ynab_account_id: "testAccountId",
      ynab_budget_id: "testBudgetId",
      ynab_flag_color: "purple",
    },
  } as any,
  transactions: [
    {
      amount: 420,
      date: new Date("1990-02-27"),
      memo: "tx1",
    },
    {
      amount: 420,
      date: new Date("1990-02-27"),
      memo: "tx2-sameDaySameAmount",
    },
    {
      amount: 69,
      date: new Date("1990-02-27"),
      memo: "tx3-sameDayDifferentAmount",
    },
    {
      amount: 69,
      date: new Date("2013-12-31"),
      memo: "tx4",
    },
  ],
};
