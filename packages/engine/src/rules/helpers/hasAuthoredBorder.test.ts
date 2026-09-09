import { afterEach, describe, expect, it } from 'vitest';
import { hasAuthoredBorder } from './hasAuthoredBorder.js';

afterEach(() => {
    document.body.replaceChildren();
});

describe('hasAuthoredBorder', () => {
    it('detects an inline border declaration', () => {
        const element = document.createElement('button');
        element.style.border = '2px solid transparent';

        expect(hasAuthoredBorder(element, document)).toBe(true);
    });

    it('detects a matching border declaration in a nested stylesheet rule', () => {
        document.body.innerHTML = `
            <style>@media screen { .authored-border { border-style: dotted; } }</style>
            <button class="authored-border">Save</button>
        `;
        const element = document.querySelector('button')!;

        expect(hasAuthoredBorder(element, document)).toBe(true);
    });

    it('returns false when matching rules do not declare a border', () => {
        document.body.innerHTML = `
            <style>.no-authored-border { color: red; }</style>
            <button class="no-authored-border">Save</button>
        `;
        const element = document.querySelector('button')!;

        expect(hasAuthoredBorder(element, document)).toBe(false);
    });

    it('safely skips a stylesheet that blocks CSSOM access', () => {
        const blockedStyleSheet = {} as CSSStyleSheet;
        Object.defineProperty(blockedStyleSheet, 'cssRules', {
            get: () => {
                throw new DOMException('Blocked', 'SecurityError');
            },
        });
        const blockedDocument = { styleSheets: [blockedStyleSheet] } as unknown as Document;

        expect(hasAuthoredBorder(document.createElement('button'), blockedDocument)).toBe(false);
    });
});
