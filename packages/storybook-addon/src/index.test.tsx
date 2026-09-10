import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { ContrastLensPanel } from './index.js';
import { themeFixture } from './theme.fixture.js';

vi.mock('storybook/theming', () => ({
    useTheme: () => themeFixture,
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

    it('re-scans when the preview reloads and again on its polling interval', async () => {
        vi.useFakeTimers();

        try {
            const iframe = document.createElement('iframe');
            iframe.id = 'storybook-preview-iframe';
            document.body.appendChild(iframe);

            const previewDoc = iframe.contentDocument!;
            const root = previewDoc.createElement('div');
            root.id = 'storybook-root';
            root.innerHTML = '<button style="border: none">Save</button>';
            previewDoc.body.appendChild(root);

            render(<ContrastLensPanel />);

            act(() => {
                iframe.dispatchEvent(new Event('load'));
            });
            await act(async () => {
                await vi.advanceTimersByTimeAsync(50);
            });

            expect(screen.getByRole('tab', { name: /violations/i })).toHaveTextContent('1');

            root.innerHTML = '<button style="border: none">Save</button><button style="border: none">Cancel</button>';
            await act(async () => {
                await vi.advanceTimersByTimeAsync(500);
            });

            expect(screen.getByRole('tab', { name: /violations/i })).toHaveTextContent('2');
        } finally {
            vi.useRealTimers();
        }
    });
});
