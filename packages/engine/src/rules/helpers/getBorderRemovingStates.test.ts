import { afterEach, describe, expect, it } from 'vitest';
import { getBorderRemovingStates } from './getBorderRemovingStates';

afterEach(() => {
    document.body.replaceChildren();
});

describe('getBorderRemovingStates', () => {
    it('detects border resets for matching interaction states', () => {
        document.body.innerHTML = `
            <style>
                .action:hover, .action:focus-visible { border: none; }
                .action[aria-disabled='true'] { border: none; }
            </style>
            <button class="action" aria-disabled="true">Save</button>
        `;
        const element = document.querySelector('button')!;
        const cssRule = document.styleSheets[0]?.cssRules[0] as CSSStyleRule | undefined;
        console.log(cssRule?.selectorText, cssRule?.style.cssText, cssRule?.style.borderStyle, cssRule?.style.borderWidth);

        expect(getBorderRemovingStates(element, document)).toMatchObject({
            states: ['hover', 'focus-visible', 'aria-disabled'],
            blockedStyleSheetCount: 0,
        });
    });

    it('walks nested stylesheet rules', () => {
        document.body.innerHTML = `
            <style>@media screen { .action:active { border-width: 0; } }</style>
            <button class="action">Save</button>
        `;
        const element = document.querySelector('button')!;

        expect(getBorderRemovingStates(element, document).states).toEqual(['active']);
    });

    it('counts stylesheets that block CSSOM access', () => {
        const blockedStyleSheet = {} as CSSStyleSheet;
        Object.defineProperty(blockedStyleSheet, 'cssRules', {
            get: () => {
                throw new DOMException('Blocked', 'SecurityError');
            },
        });
        const blockedDocument = { styleSheets: [blockedStyleSheet] } as unknown as Document;

        expect(getBorderRemovingStates(document.createElement('button'), blockedDocument)).toEqual({
            states: [],
            blockedStyleSheetCount: 1,
        });
    });
});
