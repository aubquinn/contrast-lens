import type React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { ContrastLensPanel } from './index.js';
import { themeFixture } from './theme.fixture.js';
import { render } from './vitest.setup.js';

vi.mock('storybook/theming', () => ({
    useTheme: () => themeFixture,
}));

vi.mock('storybook/internal/components', () => ({
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

const removeIframe = () => {
    document.getElementById('storybook-preview-iframe')?.remove();
};

afterEach(removeIframe);

describe('ContrastLensPanel', () => {
    it('shows a fallback message when no story is being previewed', () => {
        render(<ContrastLensPanel />);

        expect(screen.getByText('No story root found.')).toBeInTheDocument();
    });

    it('scans the previewed story and reports findings once a story root is available', async () => {
        const iframe = document.createElement('iframe');
        iframe.id = 'storybook-preview-iframe';
        document.body.appendChild(iframe);

        const previewDoc = iframe.contentDocument!;
        const root = previewDoc.createElement('div');
        root.id = 'storybook-root';
        root.innerHTML = '<button style="border: none">Save</button>';
        previewDoc.body.appendChild(root);

        render(<ContrastLensPanel />);

        expect(await screen.findByRole('tab', { name: /violations/i })).toHaveTextContent('1');
    });
});
