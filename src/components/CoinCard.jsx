import { useState, useEffect } from "react";

function CoinCard({ coin, isFavorite, toggleFavorite }) {
  const [reminder, setReminder] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`reminder-${coin.id}`);
    if (saved) setReminder(saved);
  }, [coin.id]);

  const handleSaveReminder = (e) => {
    localStorage.setItem(`reminder-${coin.id}`, reminder);
    e.preventDefault();
    setShowInput(false);
  };

  const handleReminderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInput(true);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(coin.id);
  };

  return (
    <div className="relative h-[175px] p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col gap-2">
      <div className="flex justify-between items-stretch h-full">
        <div className="flex items-start gap-4">
          <img src={coin.image} alt={coin.name} className="w-12 h-12" />
          <div className="min-w-0">
            <h2 className="text-base font-semibold break-words max-w-[140px] leading-snug line-clamp-3">
              {coin.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {coin.symbol.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center text-right">
          <p 
            data-testid="price"
            className="text-lg font-bold">
            ${coin.current_price?.toLocaleString("en-US")}
          </p>
          <p
            className={`text-sm ${
              coin.price_change_percentage_24h >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>
      </div>

      {reminder && !showInput && (
        <div className="text-s text-blue-500 italic break-words">
          🔔 ${reminder}
        </div>
      )}

      {showInput ? (
        <div className="flex items-center gap-2 mt-auto">
          <input
            id="reminder-value"
            type="text"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            onClick={(e) => e.preventDefault()}
            placeholder="Your reminder..."
            className="flex-1 px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm"
          />
          <button
            onClick={handleSaveReminder}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            💾 Save
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowInput(false);
            }}
            className="text-sm px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            ✖ Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-auto">
          <button
            onClick={handleFavoriteClick}
            className="text-xl text-yellow-400 hover:text-yellow-500"
            title={isFavorite ? "Unfavorite" : "Favorite"}
          >
            {isFavorite ? "★" : "☆"}
          </button>
          <button
            onClick={handleReminderClick}
            className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📝 Add Reminder
          </button>
        </div>
      )}
    </div>
  );
}

export default CoinCard;
