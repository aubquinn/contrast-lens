import { coverageConfigDefaults, type ViteUserConfig as UserConfig } from 'vitest/config';

export const baseVitestConfig: UserConfig = {
    test: {
        environment: 'jsdom',
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'lcov'],
            exclude: [...coverageConfigDefaults.exclude, '**/*.fixture.ts', '**/*.stories.tsx'],
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },
        },
    },
};
