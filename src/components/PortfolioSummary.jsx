export default function PortfolioSummary({ portfolio }) {
    if (!portfolio.length) return null;
  
    const summary = {};
  
    portfolio.forEach((entry) => {
      if (!summary[entry.coin]) {
        summary[entry.coin] = {
          name: entry.name,
          symbol: entry.symbol,
          totalAmount: 0,
          totalCost: 0,
        };
      }
  
      summary[entry.coin].totalAmount += entry.amount;
      summary[entry.coin].totalCost += entry.amount * entry.buyPrice;
    });
  
    const summaryList = Object.values(summary).map((coin) => ({
      ...coin,
      avgPrice: coin.totalCost / coin.totalAmount,
    }));

    const formatAmount = (num) => {
        return parseFloat(num.toFixed(6)).toString();
      };
      
  
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-3">📊 Portfolio Summary</h3>
        <ul className="space-y-2 text-sm">
          {summaryList.map((coin, i) => (
            <li key={i} className="border-b pb-2 dark:border-gray-600">
              <span className="font-medium">{coin.name}</span> ({coin.symbol.toUpperCase()})<br />
              {formatAmount(coin.totalAmount)} pcs @ avg{" "}
              <span className="text-blue-500">${coin.avgPrice.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  