module.exports = {
  update: require("./update-bank2ynab").update,
  getConfig: () => require("./bank2ynab.json")
};
