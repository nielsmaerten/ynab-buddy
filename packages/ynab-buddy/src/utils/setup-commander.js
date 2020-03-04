const program = require("commander");
const packageInfo = require("../../package.json");

module.exports = () => {
  program.version(packageInfo.version);
  program.description(packageInfo.description);

  program.usage("directory/with/files-to-parse/ [--upload]");

  program
    .option(
      "-u, --upload",
      "Upload transactions to YNAB after parsing. Default: off"
    )
    .option("-c, --clear", "Refresh ynab-buddy.config.yaml file")
    .option("-f, --force", "Don't ask confirmation when uploading to YNAB")
    .option("-v, --verbose", "Extra detailed logs");

  return program;
};
