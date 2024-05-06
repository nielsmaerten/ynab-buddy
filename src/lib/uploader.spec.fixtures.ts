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
      payee_name: "payee1",
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

export const expectedTransactions = [
  {
    amount: 420000,
    memo: "tx1",
    date: "1990-02-27",
    import_id: "YNAB:420000:1990-02-27:1",
    cleared: "cleared",
    account_id: "testAccountId",
    flag_color: "purple",
    payee_name: "payee1",
  },
  {
    amount: 420000,
    memo: "tx2-sameDaySameAmount",
    date: "1990-02-27",
    import_id: "YNAB:420000:1990-02-27:2",
    cleared: "cleared",
    account_id: "testAccountId",
    flag_color: "purple",
  },
  {
    amount: 69000,
    memo: "tx3-sameDayDifferentAmount",
    date: "1990-02-27",
    import_id: "YNAB:69000:1990-02-27:1",
    cleared: "cleared",
    account_id: "testAccountId",
    flag_color: "purple",
  },
  {
    amount: 69000,
    memo: "tx4",
    date: "2013-12-31",
    import_id: "YNAB:69000:2013-12-31:1",
    cleared: "cleared",
    account_id: "testAccountId",
    flag_color: "purple",
  },
];
