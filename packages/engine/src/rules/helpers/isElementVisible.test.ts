import { afterEach, describe, expect, it } from 'vitest';
import { isElementVisible } from './isElementVisible';

const createStyle = (values: Partial<CSSStyleDeclaration> = {}): CSSStyleDeclaration => values as CSSStyleDeclaration;

afterEach(() => {
    document.body.replaceChildren();
});

describe('isElementVisible', () => {
    it('rejects an element that is not connected', () => {
        expect(isElementVisible(document.createElement('div'), createStyle())).toBe(false);
    });

    it.each([
        ['hidden attribute', '<div hidden></div>', {}],
        ['aria-hidden', '<div aria-hidden="true"></div>', {}],
        ['display none', '<div></div>', { display: 'none' }],
        ['hidden visibility', '<div></div>', { visibility: 'hidden' }],
        ['zero opacity', '<div></div>', { opacity: '0' }],
    ])('rejects an element with %s', (_name, markup, styleValues) => {
        document.body.innerHTML = markup as string;
        const element = document.body.firstElementChild!;
        expect(isElementVisible(element, createStyle(styleValues))).toBe(false);
    });

    it('accepts a connected element without hidden presentation', () => {
        const element = document.body.appendChild(document.createElement('div'));
        const style = createStyle({ display: 'block', visibility: 'visible', opacity: '1' });
        expect(isElementVisible(element, style)).toBe(true);
    });
});
