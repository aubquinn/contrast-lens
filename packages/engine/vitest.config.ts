import { defineConfig, mergeConfig } from "vitest/config";
import { baseVitestConfig } from "../../vitest.config.base.js";

export default defineConfig(
  mergeConfig(baseVitestConfig, {
    test: {
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
      },
    },
  }),
);
