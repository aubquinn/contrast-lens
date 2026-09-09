import { defineConfig, mergeConfig } from 'vite';
import path from 'node:path';
import { baseViteConfig } from '../../vite.config.base.js';

export default defineConfig(mergeConfig(baseViteConfig, {
    build: {
        emptyOutDir: false,
        lib: {
            entry: path.resolve(import.meta.dirname, 'src/manager.ts'),
            formats: ['es'],
            fileName: () => 'manager.js',
        },
        rollupOptions: {
            external: [
                /^storybook\//,
                /^react(?:\/.*)?$/,
                /^@chakra-ui\/react$/,
                /^@heroicons\/react\//,
                /^@contrast-lens\/engine$/,
            ],
        },
    },
}));
