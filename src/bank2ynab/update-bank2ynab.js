// bank2ynab: https://github.com/bank2ynab/bank2ynab/

// If you want to use your own version of bank2ynab,
// you can override the default url by calling: bank2ynab.update('https://my.custom.url')
// Or, you can edit the following constant:
const configUrl = "https://raw.githubusercontent.com/bank2ynab/bank2ynab/develop/bank2ynab.conf";

const fs = require("fs");
const path = require("path");
const https = require("https");
const configFilePath = path.resolve("./src/bank2ynab/bank2ynab.conf");

/**
 * Downloads and writes the current version of bank2ynab.conf to configFilePath
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
        console.log("bank2ynab.conf update success.");
        fs.writeFileSync(configFilePath, body);
        resolve();
      });
    });
  });

module.exports = { update };
