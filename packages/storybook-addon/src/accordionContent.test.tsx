import { Accordion } from '@chakra-ui/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Finding } from '@contrast-lens/engine';
import { AccordionContent } from './accordionContent.js';
import { themeFixture } from './theme.fixture.js';
import { render } from './vitest.setup.tsx';

vi.mock('storybook/theming', () => ({
    useTheme: () => themeFixture,
}));

Element.prototype.scrollIntoView = vi.fn();

const renderAccordionContent = (item: Finding) =>
    render(
        <Accordion.Root collapsible defaultValue={['finding']}>
            <AccordionContent item={item} value="finding" />
        </Accordion.Root>,
    );

const makeButtonFinding = (overrides: Partial<Finding> = {}): Finding => {
    document.body.innerHTML = '<button id="save-button" style="border: none">Save</button>';
    const element = document.getElementById('save-button') as unknown as Element;

    return {
        ruleId: 'button-no-border',
        severity: 'error',
        message: 'Button has no visible border.',
        element,
        ...overrides,
    };
};

describe('AccordionContent', () => {
    it('formats the rule title and shows the element markup and selector', () => {
        renderAccordionContent(makeButtonFinding());

        expect(screen.getByText('Button no border')).toBeInTheDocument();
        expect(screen.getByText('button-no-border')).toBeInTheDocument();
        expect(screen.getByText(/#save-button/)).toBeInTheDocument();
    });

    it('renders a hint with a code sample on its own lines', () => {
        renderAccordionContent(
            makeButtonFinding({
                hint: 'Add a visible border.\nborder: 1px solid black;',
            }),
        );

        expect(screen.getByText('Add a visible border.')).toBeInTheDocument();
        expect(screen.getByText('border: 1px solid black;')).toBeInTheDocument();
    });

    it('falls back gracefully when the finding has no real DOM element', () => {
        renderAccordionContent(
            makeButtonFinding({
                element: 'not-an-element' as unknown as Element,
            }),
        );

        expect(screen.getByText(/Selector unavailable/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /jump to element/i })).toBeDisabled();
    });

    it('jumps to the element and can remove the highlight again', async () => {
        const user = userEvent.setup();
        renderAccordionContent(makeButtonFinding());

        await user.click(screen.getByRole('button', { name: /jump to element/i }));

        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
        const removeButton = await screen.findByRole('button', { name: /remove highlight/i });

        await user.click(removeButton);

        expect(await screen.findByRole('button', { name: /jump to element/i })).toBeInTheDocument();
    });
});
