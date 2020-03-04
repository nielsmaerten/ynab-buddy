const utils = require("./utils");
const fs = require("fs");
const path = require("path");
const buddy = require("ynab-buddy-core");

(async () => {
  const program = utils.setupCommander();

  program.parse(process.argv);
  let opts = program.opts();
  console.log(""); // Empty line

  //#region Show help or a welcome message
  if (opts.help) {
    program.outputHelp();
    return;
  } else {
    console.log("ynab-buddy v" + opts.version, "- Welcome!");
    console.log("Use --help to learn more about this tool.\n");
  }
  //#endregion

  if (opts.clear && fs.existsSync(utils.cliConfigPaths.own))
    fs.unlinkSync(utils.cliConfigPaths.own);
  const cliConfig = utils.getCliConfig();

  //#region Get Directory
  let dir = program.args[0];
  if (dir) {
    dir = path.resolve(program.args[0]);
    if (!fs.existsSync(dir)) {
      console.error(dir, "does not exist.");
      return;
    }
  } else {
    dir = process.cwd();
  }
  console.log("Parsing files in:", dir, "...\n");
  //#endregion

  //#region Conversion
  let allSuccessResults = [];
  fs.readdirSync(dir).forEach(f => {
    let filepath = path.resolve(dir, f);
    if (fs.statSync(filepath).isDirectory()) return;

    let outputfile = `ynab_${path.basename(filepath)}`;
    let outputpath = path.resolve(dir, outputfile);
    let customConfig = utils.getCustomConfig(f, cliConfig, opts.verbose);
    let result = buddy.parser.file(filepath, customConfig);

    if (result.success && buddy.saveResult(result, outputpath)) {
      opts.verbose && console.log("Success:");
      opts.verbose && console.log("Input  :", f);
      console.log("Parsed:", outputfile);
      allSuccessResults.push(result);
    } else if (opts.verbose) {
      console.warn("Error:", result.error);
      console.warn("Input:", f);
    }
    opts.verbose && console.log("");
  });
  //#endregion

  if (!opts.upload) return;
  for (const r of allSuccessResults) {
    let ids =
      (await utils.autoDetectAccount(r.name, cliConfig, opts.force)) ||
      (await utils.getAccountInteractive(r, cliConfig));

    if (ids && ids.budget && ids.account) {
      console.log("Uploading:", r.name, "...");
      await buddy
        .uploadResult(
          r.transactions,
          cliConfig["YNAB API Configuration"].token,
          ids.budget,
          ids.account
        )
        .then(() =>
          console.log(
            "Done:",
            r.transactions.length,
            "transactions from",
            r.name,
            "imported in YNAB."
          )
        )
        .catch(e => {
          console.error("Failed to upload:\n", e);
        });
      console.log("");
    }
  }
})();
