import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: ['packages/test-storybook/vitest.config.ts'],
    },
});
