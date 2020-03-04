const minimatch = require("minimatch");

module.exports = (filename, cliConfig) => {
  let configs = cliConfig["Custom Configurations"];
  let mappings = cliConfig["YNAB API Configuration"]["File Mappings"];

  let mapped_file = mappings.find(m => {
    return minimatch(filename, m.filename_glob);
  });

  if (mapped_file && mapped_file.custom_config) {
    console.log(
      `Using custom config '${mapped_file.custom_config}' to parse:`,
      filename
    );
    return configs.find(c => c.name === mapped_file.custom_config)
  } else return undefined;
};
