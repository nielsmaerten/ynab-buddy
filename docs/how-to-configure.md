# How to configure _ynab-buddy_

ynab-buddy is configured using a file in `<your home directory>/ynab-buddy/config.yaml`. 

This document explains all options. Use it as a guide when adjusting your configuration to work with your bank.

### Good to know

* An example config file is automatically created when ynab-buddy runs for the first time
* Disable optional settings by typing a hashtag (`#`) in front of them. Or remove the line completely.

## General settings

### `import_from`

The folder where you'll download CSV files from your bank.

```yaml
import_from: "c:/users/niels/downloads" # windows
import_from: "/home/niels/downloads"    # linux, mac os
```

**Optional:** If no folder is set, ynab-buddy will ask where to find your files every time.

### `search_subfolders`

```yaml
search_subfolders: false # only search the top folder for bank files
search_subfolders: true  # search underlying folders as well
```

### `configuration_done`

**IMPORTANT: Delete this line or set it to _true_ when you're done. ynab-buddy won't start until you do.**

## Bank Transaction Files

Repeat this section for every account.

### `account_name`

```yaml
account_name: My BNP Checking Account
# optional, you can name accounts so you can keep them apart
# ynab-buddy does not use this value.
```

### `pattern`

Use wildcard patterns to tell ynab-buddy what your bank's files look like:

```yaml
pattern: BNP_IBAN323534643_*.csv
pattern: *_VisaPersonal-*.csv
pattern: ing/savings/export.csv
```

| Pattern                   | Matches filenames such as:                                   |
| ------------------------- | ------------------------------------------------------------ |
| `BNP_IBAN323534643_*.csv` | `BNP_IBAN323534643_2021-09-12.csv`, `BNP_IBAN323534643_2021-04-20.csv` |
| `*_VisaPersonal-*.csv`    | `NM_VisaPersonal-23453423.csv`, `YourName_VisaPersonal-2020202.csv` |
| `ing/savings/export.csv`  | `export.csv`                                                 |

**Notice:** the last pattern only matches files named "export.csv". If your bank does this, create a directory structure for your accounts (for example `downloads/ing/savings/`) and place files into the folder for their account.

ynab-buddy will now be able to use the directory name + pattern to identify the correct account for each file.

### `parser`

```yaml
parser: bnp-checking-parser 
# the name of the parser to use for this file
# parsers are defined in the section 'parsers'
```

### `ynab_account_id`

```yaml
ynab_account_id: 3c8922e0-625d-423b-ab77-810edfc460b2
```

To find your account_id and budget_id, visit YNAB and open up the transaction history of an account.

```yaml
# The URL in your browser address bar should now look like this:
https://app.youneedabudget.com/1c8cdd9e-c923-4e39-9960-28664a2cd4ae/accounts/3c8922e0-625d-423b-ab77-810edfc460b2

# The first code is your budget_id, the second one is the account_id:
https://app.youneedabudget.com/[BUDGET-ID]/accounts/[ACCOUNT-ID]
```

### `ynab_budget_id`

```yaml
ynab_budget_id: 1c8cdd9e-c923-4e39-9960-28664a2cd4ae
```

See: `ynab_account_id`.

### `ynab_flag_color`

```yaml
ynab_flag_color: blue 
# possible colors are: blue, green, orange, purple, red and yellow
```

Useful if you want to distinguish imported transactions from the ones you entered yourself. If you don't want to set a flag, remove this line or disable this option by typing a `#` in front of it.

### `upload`

```yaml
upload: true  # transactions from this file will be uploaded to YNAB
upload: false # don't upload transactions from this file to YNAB
# Note: this option overrides the option 'upload_transactions'
```

### `save_parsed_file`

```yaml
save_parsed_file: true  # save the converted file as <original_filename>.YNAB.csv
save_parsed_file: false # don't save the converted file
```

### `delete_original_file`

```yaml
delete_original_file: true  # delete the bank file once it's processed
delete_original_file: false # keep the bank file after processing
```

## Parsers

Parsers tell ynab-buddy how to read a file. You can re-use a parser for multiple accounts.

### `name`

```yaml
name: bnp-checking-parser
# Provide a unique name for every parser.
# Then enter that name as the 'parser' for every bank file that should use it.
```

### `header_rows`

```yaml
header_rows: 1 
# The number of header rows your bank adds to their CSV files (most banks do this)
# This is the number of lines ynab-buddy will ignore when parsing
```

### `footer_rows`

Same as `header_rows`, but sets how many lines from the bottom should be ignored.

### `delimiter`

```yaml
delimiter: ','  # comma separated (most common)
delimiter: '\t' # tab separated
delimiter: ';'  # semicolon separated
```

The symbol used to separate columns in the CSV file. 

### `columns`

```yaml
columns: date,skip,amount,memo,skip               # 02/21/2021;ID123;-420.69;Starlink;31415
columns: skip,memo,date,outflow,inflow            # tx112;Store name;2021-02-21;234.53;0
columns: skip,memo,memo2,amount,in_out_flag;date  # id420;YNAB;USA;98.99;Out;2020-04-20
```

Configure which columns contain the data that should be extracted.  
**Important:** Separate columns using a comma (,) even if your CSV file uses another delimiter!

The following columns are supported:

| Field       | Notes                                                        |
| ----------- | ------------------------------------------------------------ |
| date        | Transaction's date. Set the format using `date_format`       |
| skip        | Use to ignore a column                                       |
| inflow      | Use in combination with 'outflow'                            |
| outflow     | Use in combination with 'inflow'                             |
| amount      | If instead of separate 'inflow' and 'outflow' columns, your bank uses a single column: use 'amount'. Negative amounts are treated as outflow. |
| memo        | You can add multiple columns to the memo field by naming them memo1, memo2, etc. |
| payee       | **Beta.** May create duplicate Payees in YNAB. If it does, I suggest adding your Payee as a *memo* field instead |
| in_out_flag | While uncommon, some banks use a single 'amount' column with only positive numbers. A separate column, 'in_out_flag' indicates whether the money's going in or out of the account. If you use this column, you should also set the option `outflow_indicator` |

### `outflow_indicator`

```yaml
outflow_indicator: Out 
# Only use this option if your CSV uses an in_out_flag
```

If the value in column `in_out_flag` starts with the `outflow_indicator`, the amount is treated as outflow. Otherwise it's inflow.

### `date_format`

```yaml
date_format: yyyy-MM-dd # e.g. 2020-04-20
date_format: M/d/yyyy   # e.g. 4/20/2020
date_format: dd/MM/yyyy # e.g. 20/04/2020
```

Date format used in your bank's csv file. For all possibilities, visit [table of possible tokens](https://moment.github.io/luxon/#/parsing?id=table-of-tokens)

### `thousand_separator`

```yaml
thousand_separator: "," # e.g. 1,234.00
thousand_separator: "." # e.g. 1.234,00
```

Optional, can be used to define the thousands separator format used by your bank

### `decimal_separator`

```yaml
decimal_separator: "," # e.g. 1.234,00
```

Optional, can be used to define the decimals separator format used by your bank. If not defined, the tool uses dot "." as default

## Upload to YNAB

### `upload_transactions`

```yaml
upload_transactions: true  # Upload transactions to YNAB after processing
upload_transactions: false # Don't upload
```

**Note:** If a file has the 'upload' option set, it will override this setting.

### `ynab_token`

```yaml
ynab_token: 1c8cdd9e-c923-N0P3-9960-28664a2cd4ae
```

Your YNAB Personal Access Token. To create one, visit: https://app.youneedabudget.com/settings/developer

This token is only used to communicate with the YNAB API. It otherwise won't leave your system and doesn't get send to anyone other than YNAB. If you suspect somebody knows your token other than yourself, you should revoke it using the link above.

Required if you want ynab-buddy to upload transactions for you.
