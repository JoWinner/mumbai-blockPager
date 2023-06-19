import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import { dependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    "process.env": {},
  },
  build: {
    target: "esnext", //browsers can handle the latest ES features
  },
  resolve: {
    alias: {
      process: "process/browser",
    },
  },
  // server: {
  //   host: true,
  // },
});
