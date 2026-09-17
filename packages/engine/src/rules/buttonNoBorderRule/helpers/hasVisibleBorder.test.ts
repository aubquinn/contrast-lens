import { describe, expect, it } from 'vitest';
import { hasVisibleBorder } from './hasVisibleBorder.js';

const createStyle = (values: Partial<CSSStyleDeclaration> = {}): CSSStyleDeclaration => values as CSSStyleDeclaration;

describe('hasVisibleBorder', () => {
    it('rejects an explicitly removed inline border', () => {
        const element = document.createElement('button');
        element.setAttribute('style', 'BORDER: NONE');

        expect(hasVisibleBorder(element, createStyle({ borderWidth: '2px' }))).toBe(false);
    });

    it('rejects borders without any positive width', () => {
        expect(hasVisibleBorder(document.createElement('button'), createStyle())).toBe(false);
    });

    it('accepts a solid shorthand border style', () => {
        const style = createStyle({ borderTopWidth: '2px', borderStyle: 'solid' });
        expect(hasVisibleBorder(document.createElement('button'), style)).toBe(true);
    });

    it.each([
        ['borderTopStyle', 'borderTopWidth'],
        ['borderRightStyle', 'borderRightWidth'],
        ['borderBottomStyle', 'borderBottomWidth'],
        ['borderLeftStyle', 'borderLeftWidth'],
    ] as const)('accepts a solid individual %s', (styleProperty, widthProperty) => {
        const style = createStyle({ [styleProperty]: 'solid', [widthProperty]: '2px' });
        expect(hasVisibleBorder(document.createElement('button'), style)).toBe(true);
    });

    it.each(['dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'])(
        'recognizes a rendered %s border',
        (borderLeftStyle) => {
            const style = createStyle({ borderLeftWidth: '2px', borderLeftStyle });
            expect(hasVisibleBorder(document.createElement('button'), style)).toBe(true);
        },
    );

    it('rejects a box shadow without a rendered border', () => {
        const style = createStyle({ boxShadow: '0 0 0 2px black' });
        expect(hasVisibleBorder(document.createElement('button'), style)).toBe(false);
    });
});
