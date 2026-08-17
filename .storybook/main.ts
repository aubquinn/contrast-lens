import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

const contrastLensAddon = import.meta.resolve('../packages/storybook-addon/preset.js');

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../packages/test-storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    core: {
        builder: '@storybook/builder-vite',
    },
    addons: ['@storybook/addon-a11y', '@storybook/addon-vitest', contrastLensAddon],
};

export default config;
