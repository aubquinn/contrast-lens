import { createContext, useContext, type ReactNode } from 'react';

export type ContrastLensTheme = {
    color: {
        secondary: string;
        defaultText: string;
    };
    background: {
        hoverable: string;
        app: string;
        content: string;
    };
    appBorderColor: string;
    textMutedColor: string;
    typography: {
        fonts: {
            mono: string;
            base: string;
        };
    };
};

export const defaultTheme: ContrastLensTheme = {
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
};

const ContrastLensThemeContext = createContext<ContrastLensTheme>(defaultTheme);

export type ThemeProviderProps = {
    theme?: ContrastLensTheme;
    children?: ReactNode;
};

export const ThemeProvider = ({ theme = defaultTheme, children }: ThemeProviderProps) => (
    <ContrastLensThemeContext.Provider value={theme}>{children}</ContrastLensThemeContext.Provider>
);

export const useContrastLensTheme = (): ContrastLensTheme => useContext(ContrastLensThemeContext);
