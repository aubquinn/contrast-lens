import type { useTheme } from 'storybook/theming';

type StorybookTheme = ReturnType<typeof useTheme>;

export const themeFixture: StorybookTheme = {
    color: {
        secondary: '#029cfd',
        defaultText: '#2e3438',
    },
    background: {
        hoverable: 'rgba(0,0,0,0.05)',
        app: '#ffffff',
        content: '#ffffff',
    },
    appBorderColor: 'rgba(0,0,0,0.1)',
    textMutedColor: '#798186',
    typography: {
        fonts: {
            mono: 'monospace',
            base: 'sans-serif',
        },
    },
} as unknown as StorybookTheme;
