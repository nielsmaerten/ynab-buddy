# ynab-buddy

### Convert (csv) files from *any* bank; upload them directly to your [YNAB](https://youneedabudget.com) Budget.

Just download transactions from your bank, run ynab-buddy, and you're done. Say goodbye to csv-converters and manual file uploads!

![ynab-buddy demonstration](https://user-images.githubusercontent.com/4604406/141378280-28cc0996-bfc7-49ed-ac06-67a78516f9c4.gif)


> By [@nielsmaerten](https://github.com/nielsmaerten)  
> [![codecov](https://codecov.io/gh/nielsmaerten/ynab-buddy/branch/main/graph/badge.svg?token=W3P5UTSTU6)](https://codecov.io/gh/nielsmaerten/ynab-buddy)
> [![Node.js CI](https://github.com/nielsmaerten/ynab-buddy/actions/workflows/node.js.yml/badge.svg)](https://github.com/nielsmaerten/ynab-buddy/actions/workflows/node.js.yml)

## How to install

* If you have NodeJS, the recommended way to get ynab-buddy is by running: `npm install -g ynab-buddy`
* Don't have NodeJS? Download ynab-buddy from the [releases page](https://github.com/nielsmaerten/ynab-buddy/releases)

## How to use

1. **Download** CSV-files containing your transactions from your bank
2. **Run** `ynab-buddy` from your terminal/command line, or double-click the executable
3. **Done**! Your transactions are now in YNAB. Start categorizing :)

## How to configure

When you run ynab-buddy for the first time, it will create a config file in your home directory. This file defines:

* how to read your bank's files
* which budget/account your transactions should be uploaded to, if at all

I recommend you check out the [Configuration Guide](./docs/how-to-configure.md) before attempting to edit your config file.

## Where to get help

* [FAQs](./docs/FAQ.md)
* [Configuration Guide](./docs/how-to-configure.md) (how to set up this tool)
* For general help: [GitHub Discussions](https://github.com/nielsmaerten/ynab-buddy/discussions) 
* For bugs: [GitHub Issues](https://github.com/nielsmaerten/ynab-buddy/issues)
* Please **DO NOT** contact YNAB Support. This is a community project, not an official YNAB service.

## Disclaimer

ynab-buddy is a **community-made tool** for YNAB.  
The YNAB support team cannot help you resolve issues with this tool.  

This software is provided "as-is", without warranty of any kind. See the [full MIT License](./LICENSE)
