import { afterEach, describe, expect, it } from 'vitest';
import { getForcedColorAdjustOptOut } from './getForcedColorAdjustOptOut.js';

afterEach(() => {
    document.body.replaceChildren();
});

describe('getForcedColorAdjustOptOut', () => {
    it('detects an inline forced-color-adjust: none declaration', () => {
        const element = document.createElement('a');
        element.style.setProperty('forced-color-adjust', 'none');

        expect(getForcedColorAdjustOptOut(element, document)).toEqual({
            optedOut: true,
            blockedStyleSheetCount: 0,
        });
    });

    it('detects a matching declaration in a plain stylesheet rule', () => {
        document.body.innerHTML = `
            <style>.opt-out { forced-color-adjust: none; }</style>
            <a class="opt-out" href="/settings">Settings</a>
        `;
        const element = document.querySelector('a')!;

        expect(getForcedColorAdjustOptOut(element, document).optedOut).toBe(true);
    });

    it('detects a declaration nested inside a forced-colors media rule', () => {
        document.body.innerHTML = `
            <style>
                @media (forced-colors: active) {
                    .opt-out { forced-color-adjust: none; }
                }
            </style>
            <a class="opt-out" href="/settings">Settings</a>
        `;
        const element = document.querySelector('a')!;

        expect(getForcedColorAdjustOptOut(element, document).optedOut).toBe(true);
    });

    it('returns false when matching rules do not opt out', () => {
        document.body.innerHTML = `
            <style>.safe-link { color: red; }</style>
            <a class="safe-link" href="/settings">Settings</a>
        `;
        const element = document.querySelector('a')!;

        expect(getForcedColorAdjustOptOut(element, document).optedOut).toBe(false);
    });

    it('ignores an opt-out declared on a non-matching selector', () => {
        document.body.innerHTML = `
            <style>.other { forced-color-adjust: none; }</style>
            <a class="safe-link" href="/settings">Settings</a>
        `;
        const element = document.querySelector('a')!;

        expect(getForcedColorAdjustOptOut(element, document).optedOut).toBe(false);
    });

    it('counts a stylesheet that blocks CSSOM access', () => {
        const blockedStyleSheet = {} as CSSStyleSheet;
        Object.defineProperty(blockedStyleSheet, 'cssRules', {
            get: () => {
                throw new DOMException('Blocked', 'SecurityError');
            },
        });
        const blockedDocument = { styleSheets: [blockedStyleSheet] } as unknown as Document;

        expect(getForcedColorAdjustOptOut(document.createElement('a'), blockedDocument)).toEqual({
            optedOut: false,
            blockedStyleSheetCount: 1,
        });
    });
});
