import { defineConfig, mergeConfig } from 'vitest/config';
import { baseVitestConfig } from '../../vitest.config.base.js';

export default defineConfig(
    mergeConfig(baseVitestConfig, {
        test: {
            // The unfinished extension only tests an API re-export; there is no runtime coverage yet.
            coverage: { enabled: false },
        },
    }),
);
