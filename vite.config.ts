import { defineConfig, mergeConfig } from "vite";
import path from "node:path";
import { baseViteConfig } from "./vite.config.base.js";

export default defineConfig(
  mergeConfig(baseViteConfig, {
    resolve: {
      alias: {
        "@contrast-lens/engine": path.resolve(import.meta.dirname, "packages/engine/src"),
        "@contrast-lens/browser-extension": path.resolve(import.meta.dirname, "packages/browser-extension/src"),
      },
    },
    build: {
      emptyOutDir: true,
      lib: {
        entry: {
          engine: path.resolve(import.meta.dirname, "packages/engine/src/index.ts"),
          "browser-extension": path.resolve(import.meta.dirname, "packages/browser-extension/src/index.ts"),
        },
        formats: ["es"],
      },
      outDir: "dist",
    },
  }),
);
