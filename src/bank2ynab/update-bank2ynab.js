// bank2ynab: https://github.com/bank2ynab/bank2ynab/

// If you want to use your own version of bank2ynab,
// you can override the default url by calling: bank2ynab.update('https://my.custom.url')
// Or, you can edit the following constant:
const configUrl = "https://raw.githubusercontent.com/bank2ynab/bank2ynab/develop/bank2ynab.conf";

const fs = require("fs");
const path = require("path");
const https = require("https");
const outputPath = path.resolve("./src/bank2ynab/");

const filenames = {
  conf: "bank2ynab.conf",
  json: "bank2ynab.json"
};

const getJsonConfig = () => {
  return JSON.stringify(require("./bank2ynab-parser").getBank2YnabConfig());
};

/**
 * Downloads and writes the current version of bank2ynab.conf to
 * bank2ynab.conf and bank2ynab.json
 */
const update = overrideUrl =>
  new Promise(resolve => {
    console.log("Updating bank2ynab.conf ...");
    https.get(overrideUrl || configUrl).on("response", function(response) {
      let body = "";
      response.on("data", function(chunk) {
        body += chunk;
      });
      response.on("end", function() {
        fs.writeFileSync(path.join(outputPath, filenames.conf), body);
        fs.writeFileSync(path.join(outputPath, filenames.json), getJsonConfig());

        console.log("bank2ynab update success.");
        resolve();
      });
    });
  });

module.exports = { update };
