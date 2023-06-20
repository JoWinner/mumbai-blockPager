import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    "process.env": {},
  },
  build: {
    target: "esnext", //browsers can handle the latest ES features
    // manualChunks: (path) =>
    //   path.split("/").reverse()[
    //     path.split("/").reverse().indexOf("node_modules") - 1
    //   ],
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
