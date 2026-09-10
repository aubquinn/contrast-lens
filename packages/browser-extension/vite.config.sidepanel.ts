import { defineConfig, mergeConfig } from 'vite';
import path from 'node:path';
import { baseViteConfig } from '../../vite.config.base.js';

export default defineConfig(
    mergeConfig(baseViteConfig, {
        build: {
            outDir: 'dist',
            emptyOutDir: false,
            rollupOptions: {
                input: path.resolve(import.meta.dirname, 'sidepanel.html'),
            },
        },
    }),
);
