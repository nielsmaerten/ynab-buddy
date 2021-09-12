# ynab-buddy

### Convert (csv) files from **any bank**. Upload them directly to your [YNAB](https://youneedabudget.com) Budget.

Just download transactions from your bank, run ynab-buddy, and you're done. No more messing around with manual file uploads or csv converters!

> By [@nielsmaerten](https://github.com/nielsmaerten)

## How to install

* If you have NodeJS, the recommended way to get ynab-buddy is by running: `npm install -g ynab-buddy`
* Don't have NodeJS? Download the tool from the [releases page](https://github.com/nielsmaerten/ynab-buddy/releases)

## How to use

1. Download CSV-files containing your transactions from your bank
2. Run `ynab-buddy` from your terminal/command line, or double-click the executable
3. Done! Your transactions are now in your YNAB Budget. Start categorizing :)

## How to configure

When you run ynab-buddy for the first time, it will create a config file in your home directory. Edit this file to:

* teach ynab-buddy how to read your bank's files
* configure into which budget/account your transactions should be imported, if at all

If you have questions about the config file, read: [How to configure ynab-buddy](./docs/how-to-configure.md)

## Where to get help

* [Frequently Asked Questions](./docs/FAQ.md)
* [How to configure ynab-buddy](./docs/how-to-configure.md)
* For general help: [GitHub Discussions](https://github.com/nielsmaerten/ynab-buddy/discussions) 
* For bugs: [GitHub Issues](https://github.com/nielsmaerten/ynab-buddy/issues)

## Disclaimer

ynab-buddy is a **fan-made tool** for YNAB.  
The YNAB support team, while awesome, cannot help you resolve issues with this tool.  

This software is provided "as-is", without warranty of any kind. See the [full MIT License](./LICENSE)
