import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { configDefaults } from "vitest/config";

export default defineConfig({
  base: "/crypto-dashboard/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "dist"],
    setupFiles: "./test/setupTests.js",
  },
});
