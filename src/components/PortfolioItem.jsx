export default function PortfolioItem({ entry, index, priceInfo, onDelete, deleting }) {
    const currentPrice = priceInfo?.current_price || 0;
    const currentValue = entry.amount * currentPrice;
    const originalValue = entry.amount * entry.buyPrice;
    const diff = currentValue - originalValue;
    const diffPercent =
      originalValue > 0 ? (diff / originalValue) * 100 : 0;
  
    const safeSymbol = typeof entry.symbol === "string" ? entry.symbol.toUpperCase() : "N/A";
    const safeName = entry.name || "Unknown";
  
    return (
      <li
        className={`border p-3 rounded shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 transition-opacity duration-300 ${
          deleting ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="font-bold flex justify-between items-center">
          <span>
            {safeName} ({safeSymbol})
          </span>
          <button
            onClick={() => onDelete(index)}
            className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 transition-colors text-s px-2 py-1 rounded"
          >
            🗑️Delete
          </button>
        </div>
        <div>Quantity: {entry.amount}</div>
        <div>Buy Price: ${entry.buyPrice.toFixed(2)}</div>
        <div>Current Price: ${currentPrice.toFixed(2)}</div>
        <div>
          Difference: {" "}
          <span className={diff >= 0 ? "text-green-600" : "text-red-600"}>
            ${diff.toFixed(2)} ({diffPercent.toFixed(2)}%)
          </span>
        </div>
      </li>
    );
  }