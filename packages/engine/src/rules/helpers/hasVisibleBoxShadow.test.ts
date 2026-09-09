import { describe, expect, it } from 'vitest';
import { hasVisibleBoxShadow } from './hasVisibleBoxShadow.js';

const createStyle = (values: Partial<CSSStyleDeclaration> = {}): CSSStyleDeclaration => values as CSSStyleDeclaration;

describe('hasVisibleBoxShadow', () => {
    it.each([undefined, '', 'none'])('rejects an absent shadow (%s)', (boxShadow) => {
        expect(hasVisibleBoxShadow(createStyle({ boxShadow }))).toBe(false);
    });

    it('accepts an outside zero-offset shadow with positive spread', () => {
        expect(hasVisibleBoxShadow(createStyle({ boxShadow: '0 0 0 2px black' }))).toBe(true);
    });

    it('handles colors containing commas and multiple shadows', () => {
        const boxShadow = 'inset 0 0 0 2px red, 0px 0px 0px 1px rgba(0, 0, 0, 0.5)';
        expect(hasVisibleBoxShadow(createStyle({ boxShadow }))).toBe(true);
    });

    it.each([
        'inset 0 0 0 2px black',
        '0 0 2px black',
        '1px 0 0 2px black',
        '0 1px 0 2px black',
        '0 0 1px 2px black',
        '0 0 0 0 black',
    ])('rejects a shadow that cannot form a visible outline: %s', (boxShadow) => {
        expect(hasVisibleBoxShadow(createStyle({ boxShadow }))).toBe(false);
    });
});
