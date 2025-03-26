import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

function App() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={
            theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"
          }
          className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md text-2xl"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: -180, scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {theme === "dark" ? (
                <Sun className="w-8 h-8" />
              ) : (
                <Moon className="w-8 h-8" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Top 10 Cryptocurrencies
      </h1>

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
  );
}

export default App;
