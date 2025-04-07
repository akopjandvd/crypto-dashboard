import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function TopMovers() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1"
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Failed to fetch coin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const topGainers = [...coins]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 20);

  const topLosers = [...coins]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    )
    .slice(0, 20);

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center">
          📊 Top Movers (24h)
        </h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-green-500">
                📈 Top Gainers
              </h2>
              <div className="space-y-3">
                {topGainers.map((coin) => (
                  <Link
                    to={`/coin/${coin.id}`}
                    key={coin.id}
                    className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:ring-2 hover:ring-green-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-6 h-6"
                        />
                        <div>
                          <h3 className="font-semibold">{coin.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {coin.symbol.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span className="text-green-500 font-bold">
                        +{coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-red-500">
                📉 Top Losers
              </h2>
              <div className="space-y-3">
                {topLosers.map((coin) => (
                  <Link
                    to={`/coin/${coin.id}`}
                    key={coin.id}
                    className="block p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:ring-2 hover:ring-red-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-6 h-6"
                        />
                        <div>
                          <h3 className="font-semibold">{coin.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {coin.symbol.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span className="text-red-500 font-bold">
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default TopMovers;
