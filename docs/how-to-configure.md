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

See: `ynab_account_id`.

### `ynab_flag_color`

Possible colors are: *blue, green, orange, purple, red and yellow.*  

Useful if you want to distinguish imported transactions from the ones you entered yourself. Disable this option (by putting an `#` in front of it) or remove it if you don't want to set a flag.

### `upload`

_true_ or _false_

If true:  transactions found in this file to will be uploaded YNAB.

### `save_parsed_file`

_true_ or _false_

If true:  ynab-buddy will save the result as `<original_filename>.ynab.csv` after conversion.

### `delete_original_file`

_true_ or _false_

If true:  delete the original file from your bank once it's been processed

## parsers

Parsers tell ynab-buddy how to read a file. You can re-use a parser for multiple accounts.

### `name`

Example: _bnp-checking-parser_

Provide a unique name for each parser, then enter that name as the `parser` setting for every file you want to use this parser.

### `header_rows`

Example: 1

If your bank adds a header to their CSV files (most do), set this to how many rows should be ignored.

### `footer_rows`

Same as `header_rows`, but sets how many lines from the bottom should be ignored.

### `delimiter`

The symbol used to separate columns in the CSV file. Often a comma (`,`) but can also be a semicolon (`;`), tab (`\t`) or something else.

### `columns`

Configure which columns contain the data that should be extracted.

| Example CSV record                                           | `columns` setting               |
| ------------------------------------------------------------ | ------------------------------- |
| `02/21/2021;ID123;-420.69;Starlink;31415`<br />`02/23/2021;ID123;420.69;Amazon Refund;65196` | `date,skip,amount,memo,skip`    |
| `tx112;Store name;2021-02-21;234.53;0`<br />`tx113;Employer name;2021-01-21;0;1234.53` | `skip,memo,date,outflow,inflow` |



### `date_format`

Example: _yyyy-M-dd_, _M/d/yyyy_

Date format used in your bank's csv file. More info: [table of possible tokens](https://moment.github.io/luxon/#/parsing?id=table-of-tokens)

## upload_to_ynab
### `upload_transactions`

*true* or *false*

If true, transactions will be uploaded to YNAB by default. Can be overridden by the `upload` setting per-file

### `ynab_token`

Your YNAB Personal Access Token.  You can create one here: https://app.youneedabudget.com/settings/developer

This token is only used to communicate with the YNAB API. It otherwise won't leave your system and doesn't get shared with anyone other than YNAB. If you suspect somebody knows your token other than yourself, you should revoke it from the link above.
