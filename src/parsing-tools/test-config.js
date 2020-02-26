module.exports = (csvString, config) => {
  // TODO: Next
  // Checks if the config can be used to parse this CSV string
  // It should be faster than actually parsing the whole file
  // For example, only parse the first line, and see if it's a valid Transaction?

  return true;
};

/**
 *    {
        "name": "Chase Credit Card 2019",
        "country": "us",
        "filenamePattern": "Chase[0-9]{4}_Activity[0-9]{8}(_[0-9]{8})*\\.CSV",
        "filenameExtension": "csv",
        "inputColumns": [
            "skip",
            "Date",
            "skip",
            "Memo",
            "skip",
            "skip",
            "Inflow"
        ],
        "dateFormat": "%m/%d/%Y",
        "headerRows": 1,
        "footerRows": 0
    }
 */
