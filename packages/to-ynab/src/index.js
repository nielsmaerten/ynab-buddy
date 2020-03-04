const utils = require("./utils");
const fs = require("fs");
const path = require("path");
const client = require("to-ynab-lib");

const program = utils.setupCommander();

program.parse(process.argv);
var opts = program.opts();
console.log(""); // Empty line

//#region Show help or a welcome message
if (opts.help) {
  program.outputHelp();
  return;
} else {
  console.log("TO-YNAB v" + opts.version, "- Welcome!");
  console.log("Use --help to learn more about this tool.\n");
}
//#endregion

if (opts.clear && fs.existsSync(utils.cliConfigPaths.own)) fs.unlinkSync(utils.cliConfigPaths.own);
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
  let customConfig = utils.getCustomConfig(f, cliConfig);
  let result = client.parser.file(filepath, customConfig);

  if (result.success && client.saveResult(result, outputpath)) {
    console.log("Success:");
    console.log("Input  :", f);
    console.log("Output :", outputfile);
    allSuccessResults.push(result);
  } else {
    console.warn("Error:", result.error);
    console.warn("Input:", f);
  }
  console.log("");
});
//#endregion

allSuccessResults.forEach(async r => {
  console.log("Ready to upload:", r.name);

  let ids = utils.autoDetectAccount(r, cliConfig);
  if (!ids) {
    ids = utils.getAccountInteractive(r, cliConfig);
  }

  await client.uploadResult(
    r.transactions,
    cliConfig["YNAB API Configuration"].token,
    ids.budget,
    ids.account
  );

  console.log("Done:", r.transactions.length, "imported in YNAB.");
});
