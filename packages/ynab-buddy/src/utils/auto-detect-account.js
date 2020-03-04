const minimatch = require("minimatch");
const inquirer = require("inquirer");

const autoDetectAccount = async (filename, cliConfig, force) => {
  let fileMapping = cliConfig["YNAB API Configuration"]["File Mappings"].find(
    m => {
      return minimatch(filename, m.filename_glob);
    }
  );
  if (!fileMapping) return undefined;

  if (!force) {
    let r = await inquirer.prompt([
      {
        type: "list",
        name: "upload",
        message: `${filename} is already linked to a YNAB Account. Upload it now?`,
        choices: ["Yes", "No, skip the file"]
      }
    ]);
    if (r.upload.startsWith("No")) return {};
  }
  return {
    account: fileMapping.account_id,
    budget: fileMapping.budget_id
  };
};

module.exports = autoDetectAccount;
