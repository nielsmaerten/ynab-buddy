# Hooks

Hooks let you inject custom logic into the import pipeline. They are loaded from `~/ynab-buddy/hooks.js` at runtime. If the file is missing, hooks are skipped. To create a starter file, run:

```bash
ynab-buddy --setup-hooks
```

This writes a template to `~/ynab-buddy/hooks.js` (and creates the folder if needed). You can edit that file directly.

## Hook functions

Each hook receives data and should return the (optionally) modified value. Returning `null`/`undefined` skips that item.

```js
function onConfigurationLoaded(config) { return config; }
function onBankFile(bankFile) { return bankFile; }
function onCsvLoaded(csvText) { return csvText; }
function onParseOptionsLoaded(options) { return options; }
function onRecord(record) { return record; }
function onTransaction(transaction, record) { return transaction; }

module.exports = {
  onConfigurationLoaded,
  onBankFile,
  onCsvLoaded,
  onParseOptionsLoaded,
  onRecord,
  onTransaction,
};
```

- `onConfigurationLoaded(config)`: Runs after `config.yaml` is parsed.
- `onBankFile(bankFile)`: Runs for each detected bank file before parsing.
- `onCsvLoaded(csv)`: Runs on the raw CSV string.
- `onParseOptionsLoaded(options)`: Runs on the csv-parse options before parsing.
- `onRecord(record)`: Runs on each parsed CSV row.
- `onTransaction(transaction, record)`: Runs on each transaction before export/upload.

## Tips

- Keep hooks deterministic; prefer returning new objects over mutating arguments.
- Log sparingly—hooks run for every record.
- If you break something, delete or rename `~/ynab-buddy/hooks.js` to disable hooks.
