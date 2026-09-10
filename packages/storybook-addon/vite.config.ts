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
                // `index` is also this package's "." export (dist/index.js). tsc emits a
                // plain transpile of it first; bundling it here overwrites that with a
                // build that inlines `@contrast-lens/ui`, which — unlike engine/chakra — is
                // a private, unpublished workspace package and must never appear as a bare
                // import a real consumer's dependency resolution has to satisfy.
                entry: {
                    manager: path.resolve(import.meta.dirname, 'src/manager.ts'),
                    index: path.resolve(import.meta.dirname, 'src/index.tsx'),
                },
                formats: ['es'],
                fileName: (_format: string, entryName: string) => `${entryName}.js`,
            },
            rollupOptions: {
                external: [/^storybook\//, /^@contrast-lens\/engine$/],
            },
        },
    }),
);
