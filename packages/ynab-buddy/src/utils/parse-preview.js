const Table = require("cli-table");

const renderPreview = parseResult => {
  const previewTable = new Table({
    head: ["Date", "Memo", "Inflow", "Outflow", "Amount"]
  });
  parseResult.transactions
    .slice(0, 3)
    .map(t => {
      return [
        t.Date || "",
        t.Memo || "",
        t.Inflow || "",
        t.Outflow || "",
        t.Amount || ""
      ];
    })
    .forEach(t => previewTable.push(t));
  console.log(previewTable.toString());
};

module.exports = renderPreview;
