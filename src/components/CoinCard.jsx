import React from "react";

function CoinCard({ coin, isFavorite, toggleFavorite }) {
  const dynamicTextSize = coin.name.length > 12 ? "text-xs" : "text-sm";
  if (!coin || !coin.current_price || coin.price_change_percentage_24h === undefined) {
    return null;
  }
  
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 w-full h-18 flex items-start justify-between gap-4 overflow-hidden">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-10 h-10 flex-shrink-0"
        />
        <div className="min-w-0">
          <h2 className="text-sm sm:text-xs font-medium break-words leading-snug max-w-[140px] max-h-[3.5rem] overflow-hidden">
            {coin.name}
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {coin.symbol.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Jobb oldal: ár + %-os változás */}
      <div className="text-right whitespace-nowrap pr-8">
        <p className="text-base font-bold" data-testid="price">
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

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(coin.id);
        }}
        className="absolute top-2 right-2 text-xl text-yellow-400 hover:text-yellow-500"
        title={isFavorite ? "Unfavorite" : "Favorite"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
}

export default CoinCard;
