# ynab-buddy

Turn cryptic bank downloads into clean, YNAB-ready transactions. Works with *any* bank.

---

## What it does

* Converts CSV files from **any bank** into files the YNAB can understand.
* Uploads transactions directly to **YNAB**, or exports a YNAB‑friendly CSV.
* Works on **macOS, Windows, and Linux** via the CLI or bundled executables.

---

## Quick start

### 1) Install

* **With Node.js:**

  ```bash
  npx ynab-buddy
  ```
* **Without Node:** download the latest release for your system: [https://github.com/nielsmaerten/ynab-buddy/releases/latest](https://github.com/nielsmaerten/ynab-buddy/releases/latest)

### 2) Configure your bank file

When you run ynab-buddy for the first time, it creates a config file in:

```
~/ynab-buddy/config.yaml
```

Open it and follow the instructions. You'll set:

* Where your bank downloads land.
* How your bank's CSV is structured.
* Which YNAB budget + account the transactions go to.

Need a walkthrough? See the **Configuration Guide**: `docs/CONFIGURATION.md`.

### 3) Import into YNAB

Download your bank CSVs, then run:

```bash
ynab-buddy
```

ynab-buddy will:

1. Parse the CSV using your template.
2. Upload transactions to your chosen YNAB account.

Prefer reviewing first? Set `upload: false` in your config, and ynab‑buddy will generate a `.YNAB.csv` for manual import.

---

## Optional: customize with hooks

Want to adjust payees, categories, amounts, or apply your own rules? Advanced users can customize pretty much every step of the process. Just run

```
ynab-buddy --setup-hooks
```

This will provide you with a starter file in:

```bash
~/ynab-buddy/hooks.js
```

See `docs/HOOKS.md` to learn more.

---

## Where to get help

* **FAQ:** `docs/FAQ.md`
* **Discussions:** [https://github.com/nielsmaerten/ynab-buddy/discussions](https://github.com/nielsmaerten/ynab-buddy/discussions)
* **Bug reports:** [https://github.com/nielsmaerten/ynab-buddy/issues](https://github.com/nielsmaerten/ynab-buddy/issues)
* Advanced setup / development: `docs/CONTRIBUTING.md`

> Please avoid contacting YNAB Support about this project. It’s community‑maintained.

---

## Support the project

If ynab‑buddy is saving you some time:

* Buy me a coffee: [https://ko-fi.com/nielsmaerten](https://ko-fi.com/nielsmaerten)
* Leave a star on GitHub: [https://github.com/nielsmaerten/ynab-buddy](https://github.com/nielsmaerten/ynab-buddy)

---

## Disclaimer

ynab‑buddy is community software, provided as‑is with no warranty. See the MIT License for details.
