function CoinCard({ coin }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={coin.image} alt={coin.name} className="w-10 h-10" />
        <div>
          <h2 className="text-lg font-semibold">{coin.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {coin.symbol.toUpperCase()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold" data-testid="price">
          ${coin.current_price.toLocaleString("en-US")}
        </p>
        <p
          className={`text-sm ${
            coin.price_change_percentage_24h >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export default CoinCard;
