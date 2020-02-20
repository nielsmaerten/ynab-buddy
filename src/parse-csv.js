module.exports = (csv, filename) => {
  // TODO(next)

  // Use the filename to find a matching config

  // Parse the csv string to 'Transactions'

  // Return the results object
  return {
    error: "oops",
    success: true,
    name: filename,
    transactions: [
      {
        Amount: 420.69,
        Date: new Date(),
        Memo: "Hello world",
        Payee: "" // Empty strings are allowed
      }
    ]
  };
};
