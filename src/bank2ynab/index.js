module.exports = {
  update: require("./update-bank2ynab").update,
  getConfigs: () => require("./bank2ynab.json")
};
