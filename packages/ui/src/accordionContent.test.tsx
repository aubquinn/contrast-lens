import { Accordion } from '@chakra-ui/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AccordionContent } from './accordionContent.js';
import { render } from './test-utils.js';
import type { DisplayFinding } from './types.js';

Element.prototype.scrollIntoView = vi.fn();

const renderAccordionContent = (item: DisplayFinding, overrides: Partial<Record<string, unknown>> = {}) =>
    render(
        <Accordion.Root collapsible defaultValue={['finding']}>
            <AccordionContent item={item} value="finding" {...overrides} />
        </Accordion.Root>,
    );

const makeButtonFinding = (overrides: Partial<DisplayFinding> = {}): DisplayFinding => {
    document.body.innerHTML = '<button id="save-button" style="border: none">Save</button>';
    const element = document.getElementById('save-button') as unknown as Element;

    return {
        id: 'finding-1',
        ruleId: 'button-no-border',
        severity: 'error',
        message: 'Button has no visible border.',
        elementMarkup: element.outerHTML,
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

    it('falls back gracefully when the finding has no live DOM element', () => {
        renderAccordionContent(
            makeButtonFinding({
                element: undefined,
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

    it('delegates highlighting to onJumpToElement/onRemoveHighlight when supplied, even without a live element', async () => {
        const user = userEvent.setup();
        const onJumpToElement = vi.fn();
        const onRemoveHighlight = vi.fn();
        const item = makeButtonFinding({ element: undefined });

        renderAccordionContent(item, { onJumpToElement, onRemoveHighlight });

        const jumpButton = screen.getByRole('button', { name: /jump to element/i });
        expect(jumpButton).toBeEnabled();

        await user.click(jumpButton);

        expect(onJumpToElement).toHaveBeenCalledWith(item);

        const removeButton = await screen.findByRole('button', { name: /remove highlight/i });
        await user.click(removeButton);

        expect(onRemoveHighlight).toHaveBeenCalledWith(item);
    });
});
