import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import TrackCoins from "./pages/TrackCoins.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/crypto-dashboard">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/track" element={<TrackCoins />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
