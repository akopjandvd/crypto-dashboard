import { useState, useEffect } from "react";
import {
  saveToPortfolio,
  getPortfolio,
  removeFromPortfolio,
} from "../utils/portfolioStorage";
import { getCoinList } from "../utils/coinListCache";
import { getCoinPrices } from "../utils/getCoinPrices";
import BackButton from "../components/BackButton";
import DarkModeToggle from "../components/DarkModeToggle";
import PortfolioSummary from "../components/PortfolioSummary";
import PortfolioItem from "../components/PortfolioItem";


export default function Portfolio() {
  const [coin, setCoin] = useState("");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [allCoins, setAllCoins] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  useEffect(() => {
    setPortfolio(getPortfolio());
    getCoinList().then(setAllCoins);
  }, []);

  useEffect(() => {
    const uniqueIds = [...new Set(portfolio.map((e) => e.coin))];
    if (uniqueIds.length > 0) {
      getCoinPrices(uniqueIds).then(setPrices);
    }
  }, [portfolio]);

  useEffect(() => {
    if (!coin || coin.length < 2 || selectedCoin) {
      setSearchResults([]);
      return;
    }

    const filtered = allCoins
      .filter(
        (c) =>
          c.name.toLowerCase().startsWith(coin.toLowerCase()) ||
          c.symbol.toLowerCase().startsWith(coin.toLowerCase())
      )
      .slice(0, 10);

    setSearchResults(filtered);
  }, [coin, allCoins, selectedCoin]);

  const handleAdd = () => {
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(buyPrice);

    if (
      !selectedCoin ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0 ||
      isNaN(parsedPrice) ||
      parsedPrice <= 0
    )
      return;

    const entry = {
      coin: selectedCoin.id,
      name: selectedCoin.name,
      symbol: selectedCoin.symbol,
      amount: parsedAmount,
      buyPrice: parsedPrice,
    };

    saveToPortfolio(entry);
    setPortfolio([...portfolio, entry]);
    setCoin("");
    setSelectedCoin(null);
    setSearchResults([]);
    setAmount("");
    setBuyPrice("");
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    setDeletingIndex(index);

    setTimeout(() => {
      removeFromPortfolio(index);
      const newList = [...portfolio];
      newList.splice(index, 1);
      setPortfolio(newList);
      setDeletingIndex(null);
    }, 300);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <DarkModeToggle />
      </div>

      <h1 className="text-xl font-bold mb-4">My Portfolio</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="w-full bg-gray-300 dark:bg-gray-700 text-sm py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {showSummary ? "Hide Summary" : "Show Summary"}
          </button>

          {showSummary && <PortfolioSummary portfolio={portfolio} />}
        </div>

        <div className="md:w-3/4">
          <div className="flex flex-col gap-2 mb-6 relative">
            <div className="relative">
              <input
                id="coin-name-to-search"
                type="text"
                placeholder="Coin name or symbol (e.g., bitcoin or btc)"
                className="p-2 border rounded w-full dark:bg-gray-800 dark:border-gray-700"
                value={coin}
                onChange={(e) => {
                  setCoin(e.target.value);
                  setSelectedCoin(null);
                }}
              />
              {searchResults.length > 0 && (
                <ul className="space-y-2">
                {portfolio
                  .filter((entry) => entry && entry.symbol && typeof entry.symbol === "string")
                  .map((entry, i) => {
                    const priceInfo = prices.find((p) => p.id === entry.coin);
                    return (
                      <PortfolioItem
                        key={i}
                        entry={entry}
                        index={i}
                        priceInfo={priceInfo}
                        deleting={deletingIndex === i}
                        onDelete={handleDelete}
                      />
                    );
                  })}
              </ul>
              
              )}
            </div>

            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />

            <input
              id="buy-price"
              type="number"
              min="0"
              step="any"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="Buy price (USD)"
              className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />

            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add to Portfolio
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Saved Coins:</h2>
            <ul className="space-y-2">
              {portfolio.map((entry, i) => {
                const priceInfo = prices.find((p) => p.id === entry.coin);
                const currentPrice = priceInfo?.current_price || 0;
                const currentValue = entry.amount * currentPrice;
                const originalValue = entry.amount * entry.buyPrice;
                const diff = currentValue - originalValue;
                const diffPercent =
                  originalValue > 0 ? (diff / originalValue) * 100 : 0;

                return (
                  <li
                    key={i}
                    className={`border p-3 rounded shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 transition-opacity duration-300 ${
                      deletingIndex === i ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="font-bold flex justify-between items-center">
                      <span>
                        {entry.name} ({entry.symbol.toUpperCase()})
                      </span>
                      <button
                        onClick={() => handleDelete(i)}
                        className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 transition-colors text-s px-2 py-1 rounded"
                      >
                        🗑️Delete
                      </button>
                    </div>
                    <div>Quantity: {entry.amount}</div>
                    <div>Buy Price: ${entry.buyPrice.toFixed(2)}</div>
                    <div>Current Price: ${currentPrice.toFixed(2)}</div>
                    <div>
                      Difference:{" "}
                      <span
                        className={
                          diff >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        ${diff.toFixed(2)} ({diffPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
