# Configuration Guide

The config lives at `~/ynab-buddy/config.yaml`. It is created on first run (or with the compiled binary) using the template in `assets/config/example.yaml`. You can also reset it by deleting the file and running `ynab-buddy` again.

## Required fields

```yaml
import_from: "/path/to/your/downloads"   # folder containing bank CSVs
skip_path_confirmation: false            # set true to skip the prompt
search_subdirectories: true              # recurse into subfolders

bank_transaction_files:
  - account_name: Example Checking
    pattern: BNP-export-IBAN01233456789-*.csv   # glob-style pattern
    parser: bnp-example-parser                  # must match a parser name
    ynab_account_id: 00000000-0000-0000-0000-000000000000
    ynab_budget_id: 00000000-0000-0000-0000-000000000000
    ynab_flag_color: purple                     # optional: purple/blue/green/yellow/red/orange
    upload: true                                # overrides upload_transactions
    save_parsed_file: false                     # write <file>.YNAB.csv
    delete_original_file: true                  # remove source after processing

parsers:
  - name: bnp-example-parser
    header_rows: 2
    footer_rows: 0
    delimiter: ";"
    columns: [skip, skip, memo, date, skip, inflow, outflow, payee]
    date_format: M/d/yyyy
    decimal_separator: "."
    thousand_separator: ","

upload_to_ynab:
  upload_transactions: false
  ynab_token: ABC12345

configuration_done: false
```

## Field reference

- `import_from`: Directory to scan for bank files.
- `skip_path_confirmation`: If `true`, uses `import_from` without prompting.
- `search_subdirectories`: If `true`, includes subfolders.
- `bank_transaction_files`: One entry per account. Each needs:
  - `pattern`: Glob-style filename pattern (supports subpaths).
  - `parser`: Name of a parser defined in `parsers`.
  - `ynab_budget_id`, `ynab_account_id`: IDs from the YNAB URL.
  - `ynab_flag_color`: Optional; one of purple/blue/green/yellow/red/orange.
  - `upload`: Overrides `upload_transactions` for this file.
  - `save_parsed_file`: Write `<original>.YNAB.csv`.
  - `delete_original_file`: Remove the source after processing.
- `parsers`: Defines how to read a bank’s CSV.
  - `columns`: Use `date`, `inflow`, `outflow`, `amount`, `memo`, `memo2`, `payee`, `in_out_flag`, or `skip`. Separate with commas regardless of CSV delimiter.
  - `date_format`: Luxon format string (e.g., `M/d/yyyy`, `yyyy-MM-dd`).
  - `thousand_separator` / `decimal_separator`: Set as needed (leave empty to skip thousands).
  - `outflow_indicator`: Required only if using `in_out_flag`.
- `upload_to_ynab`:
  - `upload_transactions`: Default upload behavior; can be overridden per file with `upload`.
  - `ynab_token`: Personal access token (https://app.youneedabudget.com/settings/developer).
- `configuration_done`: Set to `true` when finished; otherwise the app will stop and show setup instructions.

## Tips

- If your bank uses a single `amount` column with only positive numbers, add `in_out_flag` and `outflow_indicator` to the parser.
- To reset the template, delete `~/ynab-buddy/config.yaml` and run `ynab-buddy` again (or use `--setup-hooks` to eject hooks, which also ensures the config exists).
