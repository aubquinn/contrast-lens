import { defineConfig, mergeConfig } from 'vite';
import path from 'node:path';
import { baseViteConfig } from '../../vite.config.base.js';

export default defineConfig(
    mergeConfig(baseViteConfig, {
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        build: {
            outDir: 'dist',
            emptyOutDir: false,
            lib: {
                // Content scripts can't resolve bare specifiers (no bundler, no import map), so
                // this bundles the engine and the DOM-only highlight helper fully into one file.
                entry: path.resolve(import.meta.dirname, 'src/content.ts'),
                formats: ['iife'],
                name: 'ContrastLensContentScript',
                fileName: () => 'content.js',
            },
        },
    }),
);
