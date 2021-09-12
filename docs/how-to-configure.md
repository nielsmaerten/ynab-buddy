> Work in progress!

# ynab-buddy: How to configure

I recommended you at least skim this doc before using ynab-buddy. It explains all possible options.

## Intro

When ynab-buddy runs the first time, it creates a file in `<your home directory>/ynab-buddy/config.yaml`. This file tells ynab-buddy:

* how to read files from your bank
* where/whether to upload transactions

Optional settings can be disabled by putting a `#` in front of them, or by removing the line entirely.

## General

### `import_from` (optional)

Example: _C:/Users/niels/Downloads (Windows)_ or _/home/niels/Downloads_ (Linux, Mac)

The folder where you'll download your bank's files. If not set, ynab-buddy uses the current working directory. You will always have the option to change the default folder before starting conversion.

### `search_subfolders`

_true_ or _false_

If true, recusively search through subfolders to find bank files. If false, only use the top folder.

### `configuration_done`

_true_,  _false_ or not set
Delete this line or set it to true when you're done. ynab-buddy won't start until you do.

## bank_transaction_files

Add a section for every account you want to import.

### `account_name` (optional)

Example: "My BNP Checking Account"  
This name is just to make it easy for you to keep the sections apart. ynab-buddy won't use it.

### `pattern`

What do files for this account look like? You can (and probably should) use wildcards here.
For example:

| Account      | Filename                         | Pattern                   |
| ------------ | -------------------------------- | ------------------------- |
| BNP Checking | BNP_IBAN323534643_2021-09-12.csv | `BNP_IBAN323534643_*.csv` |
| Visa Credit  | NM_VisaPersonal-23453423.csv     | `*_VisaPersonal-*.csv`    |
| ING Savings  | export.csv                       | `ing/savings/export.csv`  |

**Note:** For the ING account, you can't actually determine the account from the filename. If that's the case for you: create your own folder structure and save the file into the correct folder. Then provide that folder as part of your pattern.

### `parser`

Example: *bnp-checking*

Provide the name of the parser that should be used for this file. See the section on 'parsers' below.

### `ynab_account_id`

Example: *3c8922e0-625d-423b-ab77-810edfc460b2*

Open YNAB, and view the transaction history of the account to want to import to. Check the URL in your browser. It should like this:

```
https://app.youneedabudget.com/[BUDGET-ID]/accounts/[ACCOUNT-ID]
```

```
https://app.youneedabudget.com/1c8cdd9e-c923-4e39-9960-28664a2cd4ae/accounts/3c8922e0-625d-423b-ab77-810edfc460b2
```

### `ynab_budget_id`

Example: _1c8cdd9e-c923-4e39-9960-28664a2cd4ae_

See: `ynab_account_id`

### `ynab_flag_color`

Flag 

 case "blue":

   return ynab.SaveTransaction.FlagColorEnum.Blue;

  case "green":

   return ynab.SaveTransaction.FlagColorEnum.Green;

  case "orange":

   return ynab.SaveTransaction.FlagColorEnum.Orange;

  case "purple":

   return ynab.SaveTransaction.FlagColorEnum.Purple;

  case "red":

   return ynab.SaveTransaction.FlagColorEnum.Red;

  case "yellow":

### `upload`

### `save_parsed_file`

### `delete_original_file`

parsers:

  - name: bnp-checking-parser
    header_rows: 2
    footer_rows: 0
    delimiter: ","
    columns: [skip, skip, memo, date, inflow, skip]
    date_format: M/d/YYYY

upload_to_ynab:
  upload_transactions: false
  ynab_token: ABC12345

# When you're done configuring, delete the next line:

configuration_done: false
