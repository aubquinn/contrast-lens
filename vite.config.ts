import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@contrast-lens/engine": path.resolve(__dirname, "packages/engine/src"),
      "@contrast-lens/browser-extension": path.resolve(__dirname, "packages/browser-extension/src")
    }
  },
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        engine: path.resolve(__dirname, "packages/engine/src/index.ts"),
        "browser-extension": path.resolve(__dirname, "packages/browser-extension/src/index.ts")
      },
      formats: ["es"]
    },
    outDir: "dist"
  }
});
