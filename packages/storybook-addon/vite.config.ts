import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
    build: {
        emptyOutDir: false,
        sourcemap: true,
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
});
