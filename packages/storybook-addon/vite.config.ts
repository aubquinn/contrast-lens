import { defineConfig, esmExternalRequirePlugin, mergeConfig } from 'vite';
import path from 'node:path';
import { baseViteConfig } from '../../vite.config.base.js';

export default defineConfig(
    mergeConfig(baseViteConfig, {
        // Bundle UI dependencies and React 18 JSX helpers, but keep Storybook's
        // React runtime external. Convert the helpers' CommonJS require('react')
        // to an ESM import that Storybook can replace with its manager global.
        plugins: [esmExternalRequirePlugin({ external: ['react', /^react-dom(?:\/.*)?$/] })],
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        build: {
            emptyOutDir: false,
            lib: {
                entry: path.resolve(import.meta.dirname, 'src/manager.ts'),
                formats: ['es'],
                fileName: () => 'manager.js',
            },
            rollupOptions: {
                external: [/^storybook\//, /^@contrast-lens\/engine$/],
            },
        },
    }),
);
