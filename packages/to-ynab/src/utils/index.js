module.exports = {
  getCliConfig: require("./get-cli-config").getConfig,
  cliConfigPaths: require("./get-cli-config").config_paths,
  setupCommander: require("./setup-commander"),
  getCustomConfig: require("./get-custom-bank-config"),
  autoDetectAccount: (filename, cliConfig) => {
    debugger;
    // TODO
  },
  getAccountInteractive: parseResult => {
    debugger;
    // TODO
  }
};
