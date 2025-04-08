let cachedCoins = null;

export const getCoinList = async () => {
  if (cachedCoins) return cachedCoins;

  const fromStorage = localStorage.getItem("coinListCache");
  if (fromStorage) {
    cachedCoins = JSON.parse(fromStorage);
    return cachedCoins;
  }

  const res = await fetch("https://api.coingecko.com/api/v3/coins/list");
  const data = await res.json();
  cachedCoins = data;
  localStorage.setItem("coinListCache", JSON.stringify(data));
  return data;
};
