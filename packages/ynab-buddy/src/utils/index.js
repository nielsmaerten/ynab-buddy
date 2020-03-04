module.exports = {
  getCliConfig: require("./get-cli-config").getConfig,
  cliConfigPaths: require("./get-cli-config").config_paths,
  setupCommander: require("./setup-commander"),
  getCustomConfig: require("./get-custom-bank-config"),
  autoDetectAccount: require("./auto-detect-account"),
  getAccountInteractive: require("./get-account-interactive")
};
