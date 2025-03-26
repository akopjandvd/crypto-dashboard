import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoinCard from '../src/components/CoinCard';

const coin = {
  name: "Bitcoin",
  symbol: "btc",
  current_price: 68000,
  price_change_percentage_24h: 2.5,
  image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
};

test("renders coin name and price", () => {
  render(<CoinCard coin={coin} />);
  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  expect(screen.getByTestId("price")).toHaveTextContent("$68 000");
});
