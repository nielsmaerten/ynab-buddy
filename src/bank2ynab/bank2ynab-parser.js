// Based on https://github.com/leolabs/you-need-a-parser/
// Copyright (c) 2019 Leo Bernard
// Licensed under MIT: https://github.com/leolabs/you-need-a-parser/blob/master/LICENSE

/**
 * Parses bank2ynab.conf to a javascript object
 */

const fs = require("fs");
const path = require("path");
const configFilePath = path.resolve("./src/bank2ynab/bank2ynab.conf");

const parseConfig = config => {
  const SECTION = new RegExp(/^\s*\[([^\]]+)]/);
  const KEY = new RegExp(/\s*(.*?)\s*[=:]\s*(.*)/);
  const COMMENT = new RegExp(/^\s*[;#]/);

  const lines = config.split("\n");

  const sections = {};

  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(COMMENT)) {
      continue;
    }

    const sectionMatch = line.match(SECTION);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      sections[currentSection] = { Line: String(i + 1) };
      continue;
    }

    const keyMatch = line.match(KEY);
    if (currentSection && keyMatch && keyMatch[1] && keyMatch[2]) {
      const key = keyMatch[1].trim();
      const value = keyMatch[2].trim();
      if (Object.keys(sections).includes(currentSection)) {
        sections[currentSection][key] = value;
      }
    }
  }

  return sections;
};

const filteredConfig = config =>
  Object.keys(config)
    .map(c => ({ ...config[c], Name: c }))
    .filter(c => c.Name !== "DEFAULT" && !c.Plugin && c["Source Filename Pattern"] !== "unknown!" && c["Input Columns"])
    .map(c => ({
      name: c.Name.split(" ")
        .slice(1)
        .join(" "),
      country: c.Name.split(" ")[0].toLowerCase(),
      filenamePattern: `${c["Source Filename Pattern"]}\\.${(c["Source Filename Extension"] || ".csv").substr(1)}`,
      filenameExtension: (c["Source Filename Extension"] || "csv").toLowerCase().replace(".", ""),
      inputColumns: c["Input Columns"].split(","),
      dateFormat: c["Date Format"],
      headerRows: Number(c["Header Rows"] || "1"),
      footerRows: Number(c["Footer Rows"] || "0")
    }));

const getBank2YnabConfig = () => {
  const rawConfig = fs.readFileSync(configFilePath).toString();
  const parsedConfig = parseConfig(rawConfig);
  return filteredConfig(parsedConfig);
};

module.exports.getBank2YnabConfig = getBank2YnabConfig;
