import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import Favorites from "./pages/Favorites.jsx";
import CoinDetail from "./pages/CoinDetail";
import TopMovers from "./pages/TopMovers";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/crypto-dashboard/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
        <Route path="/movers" element={<TopMovers />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
