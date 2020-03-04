const path = require("path");
const os = require("os");
const fs = require("fs");
const yaml = require("yaml");

const config_paths = {
  default: path.resolve("default-cli-config.yaml"),
  own: path.resolve(os.homedir(), "to-ynab.config.yaml")
};

const getConfig = () => {
  if (!fs.existsSync(config_paths.own)) {
    console.log("Config file not found.");
    fs.copyFileSync(config_paths.default, config_paths.own);
    console.log("Created:", config_paths.own);
  }

  const config_text = fs.readFileSync(config_paths.own).toString();
  return yaml.parse(config_text);
};

module.exports = {
  config_paths,
  getConfig
}