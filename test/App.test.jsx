import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";


import "@testing-library/jest-dom";
import App from "../src/App";


beforeAll(() => {
  window.alert = vi.fn(); 
});

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            current_price: 68000,
            price_change_percentage_24h: 2.5,
            image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "eth",
            current_price: 3500,
            price_change_percentage_24h: 2,
            image: "",
          },
        ]),
    })
  );
});

test("renders search input and filters coin list", async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  const searchInput = await screen.findByPlaceholderText("Search coins...");
  expect(searchInput).toBeInTheDocument();

  // Megjelennek az érmék
  expect(await screen.findByText("Bitcoin")).toBeInTheDocument();
  expect(await screen.findByText("Ethereum")).toBeInTheDocument();

  // Szűrés: beírjuk, hogy "eth"
  fireEvent.change(searchInput, { target: { value: "eth" } });

  // Csak az Ethereum marad
  expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
  expect(screen.getByText("Ethereum")).toBeInTheDocument();
});
