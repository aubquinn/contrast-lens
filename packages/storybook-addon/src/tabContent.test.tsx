import type React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Finding } from '@contrast-lens/engine';
import { TabContent } from './tabContent.js';
import { themeFixture } from './theme.fixture.js';
import { render } from './vitest.setup.tsx';

vi.mock('storybook/theming', () => ({
    useTheme: () => themeFixture,
}));

vi.mock('storybook/internal/components', () => ({
    Badge: ({ children, status }: { children: React.ReactNode; status: string }) => (
        <span data-testid="badge" data-status={status}>
            {children}
        </span>
    ),
}));

const makeFinding = (ruleId: string): Finding => {
    const element = document.createElement('button');

    return { ruleId, severity: 'error', message: 'A finding.', element };
};

describe('TabContent', () => {
    it('shows violation and warning counts and defaults to the violations tab', () => {
        render(<TabContent violations={[makeFinding('a'), makeFinding('b')]} warnings={[makeFinding('c')]} />);

        expect(screen.getByRole('tab', { name: /violations/i })).toHaveTextContent('2');
        expect(screen.getByRole('tab', { name: /warnings/i })).toHaveTextContent('1');
        expect(screen.getByRole('tabpanel', { name: /violations/i })).toBeVisible();
    });

    it('switches to the warnings panel when its tab is clicked', async () => {
        const user = userEvent.setup();
        render(<TabContent violations={[makeFinding('a')]} warnings={[makeFinding('b')]} />);

        await user.click(screen.getByRole('tab', { name: /warnings/i }));

        expect(screen.getByRole('tabpanel', { name: /warnings/i })).toBeVisible();
    });
});
