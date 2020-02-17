module.exports = (csv, filename = null) => {
  let now = new Date();
  return {
    name: filename || `ynab-${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}.csv`,
    transactions: []
  }
};
