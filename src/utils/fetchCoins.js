export const fetchCoins = async () => {
  const cached = localStorage.getItem("cachedCoins");
  const cachedAt = localStorage.getItem("cachedCoinsAt");

  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (cached && cachedAt && now - parseInt(cachedAt) < fiveMinutes) {
    return JSON.parse(cached);
  }

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1"
    );
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    localStorage.setItem("cachedCoins", JSON.stringify(data));
    localStorage.setItem("cachedCoinsAt", Date.now().toString());
    return data;
  } catch (err) {
    console.error("Failed to fetch coins:", err);
    throw err;
  }
};
