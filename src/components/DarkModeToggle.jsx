import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
export default function DarkModeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
      className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md text-2xl"
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          exit={{ rotateY: -180, scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {theme === "dark" ? (
            <Sun className="w-8 h-8" />
          ) : (
            <Moon className="w-8 h-8" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
