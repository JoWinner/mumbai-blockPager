import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import { dependencies } from "./package.json";

// Packages we want in the vendor aka the deps needed in the entire app.
const globalVendorPackages = ["react", "react-dom", "react-router-dom"];

function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (globalVendorPackages.includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    "process.env": {},
  },
  build: {
    target: "esnext", //browsers can handle the latest ES features
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: globalVendorPackages,
          ...renderChunks(dependencies),
        },
      },
    },
  },
  resolve: {
    alias: {
      process: "process/browser",
    },
    dedupe: [...globalVendorPackages],
  },
  // server: {
  //   host: true,
  // },
});
