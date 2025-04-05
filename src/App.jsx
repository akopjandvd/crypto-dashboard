import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import Layout from "./components/Layout";
import { Link } from "react-router-dom";

function App() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteCoins, setFavoriteCoins] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

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
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredCoins = (showOnlyFavorites ? favoriteCoins : coins)
    .filter((coin) => coin?.name && coin?.symbol)
    .filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Top 100 Cryptocurrencies
        </h1>

        <div className="mb-4 text-center space-y-2">
          <Link to="/favorites" className="text-blue-600 hover:underline text-sm block">
            ⭐ Manage favorites
          </Link>

          <div className="flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="show-favorites"
              checked={showOnlyFavorites}
              onChange={(e) => setShowOnlyFavorites(e.target.checked)}
            />
            <label htmlFor="show-favorites" className="text-sm">
              Show only favorites
            </label>
          </div>

          <input
            id="search-coins"
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl w-full max-w-md bg-white dark:bg-gray-700 text-black dark:text-white shadow-md"
          />
        </div>

        {filteredCoins.length === 0 ? (
          <p className="text-center mt-4 text-gray-500">No coins match your search.</p>
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
