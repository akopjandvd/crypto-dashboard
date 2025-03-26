import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import Layout from "./components/Layout";

import { Link } from "react-router-dom";

function App() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Top 20 Cryptocurrencies
        </h1>

        <Link to="/track" className="text-blue-600 hover:underline text-sm">
          ➕ Track custom coins
        </Link>

        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl w-full max-w-md bg-white dark:bg-gray-700 text-black dark:text-white shadow-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coins
            .filter(
              (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
        </div>
      </div>
    </Layout>
  );
}

export default App;
