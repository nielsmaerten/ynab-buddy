const inquirer = require("inquirer");
const open = require("open");
const ynab = require("ynab");
const preview = require("./parse-preview");

module.exports = async (parseResult, cliConfig) => {
  console.log(`${parseResult.name} is not yet linked to a YNAB account`);
  preview(parseResult);

  let r1 = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "editOrSelect",
      choices: [
        { name: `Create a link by editing ${cliConfig.path}`, value: 1 },
        {
          name:
            "Select a budget from the CLI (your choice won't be remembered)",
          value: 2
        },
        {
          name: "Skip this file",
          value: 0
        }
      ]
    }
  ]);

  if (!r1.editOrSelect) {
    return null;
  } else if (r1.editOrSelect === 1) {
    console.log("Opening", cliConfig.path, "...");
    await open(cliConfig.path, { wait: true });
    console.log("Exiting...");
    process.exit();
  } else {
    const api = new ynab.API(cliConfig["YNAB API Configuration"].token);
    let budgets = await api.budgets.getBudgets().catch(e => {
      console.error(e);
      process.exit();
    });
    let r2 = await inquirer.prompt([
      {
        name: "budget",
        type: "list",
        message: "Select the budget for " + parseResult.name,
        choices: budgets.data.budgets.map(b => {
          return {
            name: b.name,
            value: b.id
          };
        })
      }
    ]);
    let accounts = await api.accounts.getAccounts(r2.budget).catch(e => {
      console.error(e);
      process.exit();
    });
    let r3 = await inquirer.prompt([
      {
        name: "account",
        type: "list",
        message: "Select the account",
        choices: accounts.data.accounts.map(a => {
          return {
            name: a.name,
            value: a.id
          };
        })
      }
    ]);
    return {
      budget: r2.budget,
      account: r3.account
    };
  }
};
