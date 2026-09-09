import { coverageConfigDefaults, defineConfig, mergeConfig } from 'vitest/config';
import { baseVitestConfig } from '../../vitest.config.base.js';

export default defineConfig(
    mergeConfig(baseVitestConfig, {
        test: {
            setupFiles: ['./src/vitest.setup.ts'],
            coverage: {
                exclude: [
                    ...coverageConfigDefaults.exclude,
                    '**/*.fixture.ts',
                    '**/*.stories.tsx',
                    'src/TestComponents.tsx',
                ],
            },
        },
    }),
);
