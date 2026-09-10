import { coverageConfigDefaults, type ViteUserConfig as UserConfig } from 'vitest/config';

export const baseVitestConfig: UserConfig = {
    test: {
        environment: 'jsdom',
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.{js,jsx,ts,tsx}'],
            exclude: [
                ...coverageConfigDefaults.exclude,
                '**/*.d.ts',
                '**/*.test-d.ts',
                '**/*.fixture.{ts,tsx}',
                '**/*.stories.{ts,tsx}',
                '**/vitest.setup.{ts,tsx}',
            ],
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },
        },
    },
};
