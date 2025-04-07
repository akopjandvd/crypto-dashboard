import { saveAs } from "file-saver";

function ExportToCSV({ coins, filename = "coins.csv" }) {
  const handleExport = () => {
    if (!coins || coins.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Name", "Symbol", "Price (USD)", "Market Cap", "24h Change (%)"];
    const rows = coins.map((coin) => [
      coin.name,
      coin.symbol.toUpperCase(),
      coin.current_price,
      coin.market_cap,
      coin.price_change_percentage_24h?.toFixed(2),
    ]);

    const csvContent =
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm"
    >
      ⬇️ Export to CSV
    </button>
  );
}

export default ExportToCSV;
