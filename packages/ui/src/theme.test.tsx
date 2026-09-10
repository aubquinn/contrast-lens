import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { defaultTheme, ThemeProvider, useContrastLensTheme } from './theme.js';

const ThemeProbe = () => {
    const theme = useContrastLensTheme();

    return <span>{theme.color.secondary}</span>;
};

describe('useContrastLensTheme', () => {
    it('returns the default theme when no provider is present', () => {
        render(<ThemeProbe />);

        expect(screen.getByText(defaultTheme.color.secondary)).toBeInTheDocument();
    });

    it('returns the theme supplied by ThemeProvider', () => {
        const customTheme = { ...defaultTheme, color: { ...defaultTheme.color, secondary: '#ff00ff' } };

        render(
            <ThemeProvider theme={customTheme}>
                <ThemeProbe />
            </ThemeProvider>,
        );

        expect(screen.getByText('#ff00ff')).toBeInTheDocument();
    });
});
