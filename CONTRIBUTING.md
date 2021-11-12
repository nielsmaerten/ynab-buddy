# ynab-buddy

## Contributing

For new features: start a new topic in GitHub discussions. For bugs: use GitHub issues. Code changes/updates can be suggested using a Pull Request. If you'd like to contribute, first of all: thank you! It's recommended to first discuss any features you'd like to add on the Discussions page. You probably don't want to spend your precious time on a feature somebody else may already be working on.

## Technical Docs

### Development Env

This project uses Yarn v2 (Berry). Make sure you have the latest version of yarn installed, then run `yarn` in the project root to unpack and link dependencies. The recommended IDE is VS Code.

### Scripts (package.json)

`start`: Runs the app via ts-node. To debug, run this script from a Javascript Debug Terminal in VS Code

`build`: Builds Typescript files to Javascript ES5 and outputs to dist/

`package`: Compiles javascript files from dist/ into binaries for mac, linux and windows. Outputs to bin/

`publish:np`: Publish a new version to NPM and GitHub. See 'Publishing' for details

`test`: Runs tests using Jest

`lint`: Runs prettier

### Testing

The aim is to keep test coverage above 95%. Tests extensively use mocking to ensure they are only testing the code under spec. When running on GitHub Actions, coverage info is uploaded to Codecov.

### Publishing

* Switch to main branch
* Run `yarn run publish:np`
* The project gets built to dist/
* `np` creates a new version on NPM and GitHub
* GitHub builds the binaries and adds them to a (new) release
* Update this release notes using the previous release as a template
* Users running an old version will receive a notification pointing to the Releases page on GitHub

### Architecture deep dive (work in progress)

* When you run ynab-buddy for the first time, a config file is created in the home directory. The assets folder contains the template
* This file tells ynab-buddy how to parse your bank's files, and where to upload transactions
* Once configured, ynab-buddy scans the import directory for files that match the filename patterns listed in its configuration. A matched file is treated as a BankFile
* Every BankFile file will also have a Parser, telling it which columns contain relevant info, how dates are formatted, etc
* The CSV of all BankFiles is parsed, and Transactions are created from the records according to the linked Parser
* When parsing is done, ynab-buddy has a list of Transactions. For each transaction, it will know
  * If it should be uploaded to YNAB
  * Which YNAB Account and Budget it is matched to
  * Additional metadata
* Uploadable transactions are sent to YNAB. Duplicates are prevented using an ImportId
  * YNAB API is accessed using a personal developer token that the user has to add into their config file
* Optionally, source BankFiles are now deleted from the filesystem
* Optionally, the converted YNAB csv files are saved
* Script ends.

