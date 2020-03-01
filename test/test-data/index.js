const fs = require("fs");
const path = require("path");

const valid_filename = "export_BE11123456789012_20180304_1422.csv";
const valid_filepath = path.resolve("test/test-files", valid_filename);

const testData = {
  valid: {
    filename: valid_filename,
    filepath: valid_filepath,
    csvString: fs.readFileSync(valid_filepath).toString()
  },
  invalid: {
    filename: "LOL. N0PE",
    csvString: "LOL. N0PE"
  },
  files: {
    withValidDefaultConfigs: [
      "20171001-20171106.csv",
      "2018-04-14_10-52-13_bunq-transactieoverzicht.csv",
      "20180226-1000594757-umsatz.CSV",
      "2019-03-02_11-50-46_bunq-statement.csv",
      "CSV_A_20180414_112204.csv",
      "dba33fceecd62c3c727893361e0ba4d3.P000000027355791.csv",
      "export_BE11123456789012_20180304_1422.csv",
      "export_KBC-Mastercard Business Essential_20200204_1604.csv",
      "MonzoDataExport_February2018_2018-02-26_174335.csv",
      "Movements_1234512345_201805271848.csv",
      "statement_1.csv",
      "TH_20180101-20180523_page_1.csv",
      "TH_20180101-20180523_strana_1.csv",
      "TH_20180521-20180523.csv",
      "Umsaetze_KtoNr538917600_EUR_02-03-2018_1503.CSV",
      "umsatz-1234________1234-20180227.CSV"
    ]
  },
  customConfigs: {
    "20180226_12345678.csv": {
      inputColumns: ["Date", "Memo", "Amount", "Balance"],
      dateFormat: undefined,
      // Not providing a dateFormat will return dates as strings
      // this is OK for file export, but not for uploading to the ynab api
      headerRows: 1
    },
    "kta_ei.dat": {
      separator: '|',
      dateFormat: "%Y%m%d",
      headerRows: 1,
      inputColumns: ["skip", "skip", "Date", "Memo", "Amount"]
    },
    "MS_JANE_SMITH_01-12-2019_14-12-2019.csv": {
      inputColumns: ["Date", "Memo", "Outflow"],
      headerRows: 1,
      dateFormat: "%d-%b-%Y"
      // Not all transactions have a date in this file. They will get date: null
      // When saving to file or uploading to API, transactions with no date should be skipped
    },
    "test_delimiter_tab.csv": {
     // separator: "\t", // Use auto separator detection
      dateFormat: "%d.%m.%Y",
      inputColumns: ["Date", "Memo", "skip", "skip", "Amount"]
    },
   // "TransactionHistory_20180418043121.csv": {},
   // "W80844_EBH_201945.202122.csv": {}
  }
};

module.exports = testData;
