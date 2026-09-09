import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores([
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/storybook-static/**',
        '.pnpm-store/**',
        '.storybook/**',
        '.vscode/**',
    ]),
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    {
        files: ['packages/browser-extension/**/*.{js,ts}'],
        languageOptions: { globals: globals.webextensions },
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        settings: { react: { version: '18.3' } },
        rules: {
            // The project uses the automatic JSX runtime (tsconfig `jsx: "react-jsx"`), which never
            // requires `React` to be in scope, so this classic-transform rule is obsolete here.
            'react/react-in-jsx-scope': 'off',
        },
    },
]);
