import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Layout from "../components/Layout";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

function CoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [reminder, setReminder] = useState(() => localStorage.getItem(`reminder-${id}`) || "");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function fetchCoin() {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await res.json();
        setCoin(data);
      } catch (error) {
        console.error("Error fetching coin details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCoin();
  }, [id]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );
        const data = await res.json();
        const labels = data.prices.map((p) =>
          new Date(p[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        );
        const prices = data.prices.map((p) => p[1]);
        setChartData({
          labels,
          datasets: [
            {
              label: "Price (USD)",
              data: prices,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Chart fetch failed:", err);
      }
    }
    fetchChartData();
  }, [id]);

  const saveReminder = () => {
    localStorage.setItem(`reminder-${id}`, reminder);
    setEditMode(false);
  };

  if (loading) return <Layout><p>Loading coin details...</p></Layout>;
  if (!coin) return <Layout><p>Coin not found.</p></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <img src={coin.image.large} alt={coin.name} className="w-10 h-10" />
          <h1 className="text-3xl font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h1>
        </div>

        {chartData && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">7-Day Price Chart</h3>
            <Line data={chartData} />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow space-y-4 mt-6">
          <p><strong>Current Price:</strong> ${coin.market_data.current_price.usd.toLocaleString("en-US")}</p>
          <p><strong>Market Cap:</strong> ${coin.market_data.market_cap.usd.toLocaleString("en-US")}</p>
          <p><strong>24h Volume:</strong> ${coin.market_data.total_volume.usd.toLocaleString("en-US")}</p>
          <p><strong>Homepage:</strong>{" "}
            <a href={coin.links.homepage[0]} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              {coin.links.homepage[0]}
            </a>
          </p>
          <div className="pt-4">
            <h3 className="font-semibold text-base mb-1">🔔 Reminder:</h3>
            {editMode ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  placeholder="Enter reminder..."
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveReminder}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                  >
                    ✖ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-400 italic">
                  {reminder ? `“$${reminder}”` : "No reminder set."}
                </span>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  ✏️ {reminder ? "Edit" : "Add"} Reminder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CoinDetail;
