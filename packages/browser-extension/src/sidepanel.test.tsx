import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidePanelApp } from './sidepanel.js';
import type { ScanResponse } from './messages.js';

const sendMessage = vi.fn();
const tabsQuery = vi.fn();

beforeEach(() => {
    sendMessage.mockReset();
    tabsQuery.mockReset();
    tabsQuery.mockResolvedValue([{ id: 7 }]);

    vi.stubGlobal('chrome', {
        tabs: {
            query: tabsQuery,
            sendMessage,
        },
    });
});

const scanResponse: ScanResponse = {
    findings: [
        {
            id: 'finding-0',
            ruleId: 'button-no-border',
            severity: 'error',
            message: 'Button has no visible border.',
            elementMarkup: '<button>Save</button>',
        },
        {
            id: 'finding-1',
            ruleId: 'custom-role-button',
            severity: 'warning',
            message: 'Custom element uses role="button".',
            elementMarkup: '<div role="button">Cancel</div>',
        },
    ],
};

describe('SidePanelApp', () => {
    it('scans the active tab and renders the returned violations and warnings', async () => {
        sendMessage.mockResolvedValue(scanResponse);
        const user = userEvent.setup();
        render(<SidePanelApp />);

        await user.click(screen.getByRole('button', { name: /scan current page/i }));

        expect(await screen.findByRole('tab', { name: /violations/i })).toHaveTextContent('1');
        expect(screen.getByRole('tab', { name: /warnings/i })).toHaveTextContent('1');
        expect(sendMessage).toHaveBeenCalledWith(7, { type: 'CONTRAST_LENS_SCAN' });
    });

    it('shows an error when scanning fails', async () => {
        sendMessage.mockRejectedValue(new Error('No receiving end.'));
        const user = userEvent.setup();
        render(<SidePanelApp />);

        await user.click(screen.getByRole('button', { name: /scan current page/i }));

        expect(await screen.findByText('No receiving end.')).toBeInTheDocument();
    });

    it('sends a highlight message with the finding id when jumping to an element, and again on removal', async () => {
        sendMessage.mockResolvedValueOnce(scanResponse).mockResolvedValue({ ok: true });
        const user = userEvent.setup();
        render(<SidePanelApp />);

        await user.click(screen.getByRole('button', { name: /scan current page/i }));
        await screen.findByRole('tab', { name: /violations/i });
        await user.click(screen.getByRole('button', { name: /button no border/i }));

        await user.click(screen.getByRole('button', { name: /jump to element/i }));

        expect(sendMessage).toHaveBeenLastCalledWith(7, { type: 'CONTRAST_LENS_HIGHLIGHT', id: 'finding-0' });

        await user.click(await screen.findByRole('button', { name: /remove highlight/i }));

        expect(sendMessage).toHaveBeenLastCalledWith(7, { type: 'CONTRAST_LENS_UNHIGHLIGHT' });
    });

    it('shows an error when there is no active tab to scan', async () => {
        tabsQuery.mockResolvedValue([]);
        const user = userEvent.setup();
        render(<SidePanelApp />);

        await user.click(screen.getByRole('button', { name: /scan current page/i }));

        expect(await screen.findByText('No active tab to scan.')).toBeInTheDocument();
        expect(sendMessage).not.toHaveBeenCalled();
    });

    it('mounts itself into #root when the document already has one', async () => {
        document.body.innerHTML = '<div id="root"></div>';
        vi.resetModules();

        await import('./sidepanel.js');

        expect(document.getElementById('root')?.textContent).toContain('Contrast Lens');
    });
});
