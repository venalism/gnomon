import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, "src/content/content-script.tsx"),
      output: {
        format: "iife",
        name: "GnomonContentScript",
        entryFileNames: "assets/content-script.js",
        chunkFileNames: "assets/content-script-[name].js",
        assetFileNames: "assets/content-script-[name][extname]",
        inlineDynamicImports: true
      }
    }
  }
});
