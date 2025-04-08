import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DarkModeToggle from "./DarkModeToggle";
import BackButton from "./BackButton";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: Infinity,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
          },
        }}
      />

      <div className="flex justify-between items-center mb-6">
        {location.pathname !== "/" ? <BackButton /> : <div />}
        <DarkModeToggle />
      </div>

      {children}
    </div>
  );
}

export default Layout;
