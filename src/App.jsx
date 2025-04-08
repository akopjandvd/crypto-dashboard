import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import Layout from "./components/Layout";
import ExportToCSV from "./components/ExportToCSV";
import { fetchCoins } from "./utils/fetchCoins";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function App() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteCoins, setFavoriteCoins] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [sortOption, setSortOption] = useState("market_cap-desc");
  const [loading, setLoading] = useState(true);

  const toggleFavorite = (id) => {
    const exists = favoriteCoins.find((c) => c.id === id);
    let updated;
    if (exists) {
      updated = favoriteCoins.filter((c) => c.id !== id);
    } else {
      const coinToAdd = coins.find((c) => c.id === id);
      if (!coinToAdd) return;
      updated = [...favoriteCoins, coinToAdd];
    }
    setFavoriteCoins(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const data = await fetchCoins();
        setCoins(data);
      } catch (err) {
        console.error(err);
        alert("⚠️ Failed to load coin data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadCoins();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const reminders = Object.keys(localStorage)
        .filter((key) => key.startsWith("reminder-"))
        .map((key) => ({
          id: key.replace("reminder-", ""),
          value: parseFloat(localStorage.getItem(key)),
        }));

      if (reminders.length === 0) return;

      const ids = reminders.map((r) => r.id).join(",");
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
        );
        const data = await res.json();

        data.forEach((coin) => {
          const reminder = reminders.find((r) => r.id === coin.id);
          if (!reminder || isNaN(reminder.value)) return;

          const price = coin.current_price;
          const alertKey = `alerted-${coin.id}-${reminder.value}`;

          if (!sessionStorage.getItem(alertKey)) {
            const hit = price >= reminder.value;
            if (hit) {
              toast.custom((t) => (
                <div className="bg-gray-800 text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-4 max-w-sm">
                  <div className="text-xl">🔔</div>
                  <div className="flex-1 text-sm">
                    <strong>{coin.name}</strong> crossed your reminder!
                    <br />
                    Target:{" "}
                    <span className="text-blue-400">${reminder.value}</span>
                    <br />
                    Current:{" "}
                    <span className="text-green-400">
                      ${price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="ml-2 text-sm text-gray-300 hover:text-white"
                  >
                    ✖
                  </button>
                </div>
              ));
              sessionStorage.setItem(alertKey, "1");
            }
          }
        });
      } catch (err) {
        console.error("Price alert check failed", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const sortCoins = (coinList) => {
    const sorted = [...coinList];
    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => a.current_price - b.current_price);
      case "price-desc":
        return sorted.sort((a, b) => b.current_price - a.current_price);
      case "change-asc":
        return sorted.sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h
        );
      case "change-desc":
        return sorted.sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        );
      case "market_cap-asc":
        return sorted.sort((a, b) => a.market_cap - b.market_cap);
      case "market_cap-desc":
        return sorted.sort((a, b) => b.market_cap - a.market_cap);
      default:
        return sorted;
    }
  };

  const filteredCoins = sortCoins(
    (showOnlyFavorites ? favoriteCoins : coins)
      .filter((coin) => coin?.name && coin?.symbol)
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Top 100 Cryptocurrencies
        </h1>

        <div className="mb-4 text-center space-y-4">
          <Link
            to="/favorites"
            className="text-blue-600 hover:underline text-sm block"
          >
            ⭐ Manage favorites
          </Link>
          <Link
            to="/movers"
            className="text-blue-600 hover:underline text-sm block"
          >
            📊 Top Movers (24h)
          </Link>
          <Link
            to="/portfolio"
            className="text-blue-600 hover:underline text-sm block"
          >
            Portfolio
          </Link>

          <div className="flex justify-center gap-2 flex-wrap items-center">
            <label
              htmlFor="show-favorites"
              className="text-sm flex items-center gap-1"
            >
              <input
                type="checkbox"
                id="show-favorites"
                checked={showOnlyFavorites}
                onChange={(e) => setShowOnlyFavorites(e.target.checked)}
              />
              Show only favorites
            </label>

            <input
              id="search-coins"
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-xl w-64 bg-white dark:bg-gray-700 text-black dark:text-white shadow-md"
            />

            <select
              id="sort-order"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-gray-700 text-black dark:text-white shadow-md text-sm"
            >
              <option value="market_cap-desc">Market Cap ↓</option>
              <option value="market_cap-asc">Market Cap ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="price-asc">Price ↑</option>
              <option value="change-desc">24h % Change ↓</option>
              <option value="change-asc">24h % Change ↑</option>
            </select>
          </div>

          <ExportToCSV coins={filteredCoins} />
        </div>

        {loading ? (
          <p className="text-center mt-4 text-gray-500">Loading...</p>
        ) : filteredCoins.length === 0 ? (
          <p className="text-center mt-4 text-gray-500">
            {coins.length === 0
              ? "⚠️ Unable to load coin data at the moment."
              : "No coins match your search."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {filteredCoins.map((coin) => (
              <Link
                to={`/coin/${coin.id}`}
                key={coin.id}
                className="block hover:ring-2 hover:ring-blue-500 transition rounded-xl"
              >
                <CoinCard
                  coin={coin}
                  isFavorite={favoriteCoins.some((c) => c.id === coin.id)}
                  toggleFavorite={toggleFavorite}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
