import { defineConfig, mergeConfig } from 'vitest/config';
import { baseVitestConfig } from '../../vitest.config.base.js';

export default defineConfig(
    mergeConfig(baseVitestConfig, {
        test: {
            setupFiles: ['./src/vitest.setup.ts'],
        },
    }),
);
