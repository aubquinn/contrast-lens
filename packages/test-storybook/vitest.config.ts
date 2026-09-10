import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig } from 'vitest/config';

const workspaceRoot = path.resolve(import.meta.dirname, '../..');

export default defineConfig({
    // Storybook includes stories from this package and the shared test components.
    root: workspaceRoot,
    resolve: {
        alias: {
            // Resolve the browser renderer from this package when Vitest runs at the workspace root.
            react: path.dirname(fileURLToPath(import.meta.resolve('react/package.json'))),
            'react-dom': path.dirname(fileURLToPath(import.meta.resolve('react-dom/package.json'))),
        },
    },
    plugins: [storybookTest({ configDir: path.resolve(import.meta.dirname, '../../.storybook') })],
    test: {
        name: 'storybook',
        // The plugin calculates story globs before Vite applies its root override.
        root: workspaceRoot,
        // The Storybook plugin supplies its own excludes; preserve Vitest's node_modules exclusion.
        exclude: [...configDefaults.exclude],
        browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            screenshotDirectory: path.join(workspaceRoot, '.vitest-attachments/screenshots'),
            instances: [{ browser: 'chromium' }],
        },
    },
});
