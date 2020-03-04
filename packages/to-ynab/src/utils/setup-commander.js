const program = require("commander");
const packageInfo = require("../../package.json");

module.exports = () => {
  program.version(packageInfo.version);
  program.description(packageInfo.description);

  program.usage("directory/with/files-to-parse/ [--upload]");

  program.option(
    "-u, --upload",
    "Upload transactions to YNAB after parsing. Default: off"
  );
  
  program.option(
    "-c, --clear",
    "Refresh to-ynab.config.yaml file"
  );

  return program;
};
