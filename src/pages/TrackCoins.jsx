import { useState } from "react";
import Layout from "../components/Layout";


function TrackCoins() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackedCoins, setTrackedCoins] = useState(() => {
    const saved = localStorage.getItem("trackedCoins");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
      const data = await res.json();
      setResults(data.coins || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackCoin = (coin) => {
    if (trackedCoins.find((c) => c.id === coin.id)) return;
    const updated = [...trackedCoins, coin];
    setTrackedCoins(updated);
    localStorage.setItem("trackedCoins", JSON.stringify(updated));
  };

  const handleUntrackCoin = (coinId) => {
    const updated = trackedCoins.filter((coin) => coin.id !== coinId);
    setTrackedCoins(updated);
    localStorage.setItem("trackedCoins", JSON.stringify(updated));
  };
  return (
    <Layout>

    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      <h1 className="text-2xl font-bold mb-4">Track Custom Coins</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search for a coin..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
          <h2 className="text-xl font-semibold mb-2">Search results:</h2>
        <div className="grid gap-4">
          {results.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-4">
                <img src={coin.thumb} alt={coin.name} className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-semibold">{coin.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {coin.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTrackCoin(coin)}
                className="px-3 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm"
              >
                ➕ Track
              </button>
            </div>
          ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Your tracked coins:</h2>
          <div className="grid gap-4">
            {trackedCoins.map((coin) => (
              <div
                key={coin.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img src={coin.thumb} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <h2 className="text-lg font-semibold">{coin.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {coin.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUntrackCoin(coin.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm"
                >
                  🗑️ Untrack
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>

  );
}

export default TrackCoins;
