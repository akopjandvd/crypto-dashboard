import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App"; 


// Mockoljuk a fetch-et, hogy ne a valódi API-t hívja
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: "btc", name: "Bitcoin", symbol: "btc", current_price: 68000, price_change_percentage_24h: 1, image: "" },
          { id: "eth", name: "Ethereum", symbol: "eth", current_price: 3500, price_change_percentage_24h: 2, image: "" },
        ]),
    })
  );
});

test("renders search input and filters coin list", async () => {
  render(<App />);

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
