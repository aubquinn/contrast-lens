import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../packages/test-storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    core: {
        builder: '@storybook/builder-vite',
    },
    addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
};

export default config;
