export const getCoinPrices = async (ids) => {
    if (ids.length === 0) return [];
  
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(",")}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.current_price,
    }));
  };
  