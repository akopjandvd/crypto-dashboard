import { useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function Favorites() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      );
      const data = await res.json();
      setResults(data.coins || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (coin) => {
    if (favorites.find((c) => c.id === coin.id)) return;
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin.id}`
      );
      const [fullCoin] = await res.json();
      if (!fullCoin) throw new Error("Coin data not found");
      const updated = [...favorites, fullCoin];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to fetch full coin data:", error);
    }
  };

  const handleRemoveFavorite = (coinId) => {
    const updated = favorites.filter((coin) => coin.id !== coinId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-4">Manage Favorites</h1>

        <div className="flex gap-2 mb-6">
          <input
            id="search-coin"
            type="text"
            placeholder="Search for a coin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="px-4 py-2 rounded-xl w-full max-w-md bg-white dark:bg-gray-700 text-black dark:text-white shadow-md"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your favorites:</h2>
            <div className="grid gap-4">
              {favorites.map((coin) =>
                coin?.symbol ? (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
                  >
                    <Link
                      to={`/coin/${coin.id}`}
                      className="flex items-center gap-4 hover:underline"
                    >
                      <img
                        src={coin.image || coin.thumb}
                        alt={coin.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">{coin.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {coin.symbol.toUpperCase()}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFavorite(coin.id);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm"
                    >
                      🗑️ Remove from Favorites
                    </button>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Search results:</h2>
            <div className="grid gap-4">
              {results.map((coin) => {
                const isAlreadyFavorite = favorites.some(
                  (fav) => fav.id === coin.id
                );

                return coin?.symbol ? (
                  <div
                    key={coin.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={coin.thumb}
                        alt={coin.name}
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold break-words">
                          {coin.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {coin.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    {isAlreadyFavorite ? (
                      <span
                        title="Already added to favorites"
                        className="px-3 py-1 bg-gray-400 text-white rounded-xl text-sm opacity-70 cursor-not-allowed"
                      >
                        ★ Favorited
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddFavorite(coin)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 text-sm shrink-0"
                      >
                        ★ Favorite
                      </button>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Favorites;
