import type { ViteUserConfig as UserConfig } from "vitest/config";

export const baseVitestConfig: UserConfig = {
    test: {
        environment: "jsdom",
    },
};
