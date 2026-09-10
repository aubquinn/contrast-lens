import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TabContent } from './tabContent.js';
import { render } from './test-utils.js';
import type { DisplayFinding } from './types.js';

const makeFinding = (ruleId: string): DisplayFinding => {
    const element = document.createElement('button');

    return { id: ruleId, ruleId, severity: 'error', message: 'A finding.', elementMarkup: element.outerHTML, element };
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
