import { afterEach, describe, expect, it } from 'vitest';
import { Severity } from '../../core/types';
import { getBorderWidthSeverity } from './getBorderWidthSeverity';
import { hasExplicitNoBorder } from './hasExplicitNoBoarder';
import { hasVisibleBorder } from './hasVisibleBorder';
import { hasVisibleBoxShadow } from './hasVisibleBoxShadow';
import { isElementVisible } from './isElementVisible';

const createStyle = (values: Partial<CSSStyleDeclaration> = {}): CSSStyleDeclaration => values as CSSStyleDeclaration;

afterEach(() => {
    document.body.replaceChildren();
});

describe('getBorderWidthSeverity', () => {
    it('returns null when every border width is zero or missing', () => {
        expect(getBorderWidthSeverity(createStyle())).toBeNull();
        expect(
            getBorderWidthSeverity(
                createStyle({
                    borderTopWidth: '0px',
                    borderRightWidth: '0px',
                    borderBottomWidth: '0px',
                    borderLeftWidth: '0px',
                }),
            ),
        ).toBeNull();
    });

    it('returns an error when any positive border is below the minimum width', () => {
        expect(
            getBorderWidthSeverity(
                createStyle({
                    borderTopWidth: '3px',
                    borderRightWidth: '1px',
                    borderBottomWidth: '4px',
                    borderLeftWidth: '2px',
                }),
            ),
        ).toBe(Severity.ERROR);
    });

    it('accepts positive borders at or above the minimum width', () => {
        expect(
            getBorderWidthSeverity(
                createStyle({
                    borderTopWidth: '2px',
                    borderRightWidth: '3px',
                    borderBottomWidth: '4px',
                    borderLeftWidth: '5px',
                }),
            ),
        ).toBeNull();
    });

    it('allows floating-point values within the comparison tolerance', () => {
        expect(getBorderWidthSeverity(createStyle({ borderTopWidth: '1.9995px' }))).toBeNull();
    });
});

describe('hasExplicitNoBorder', () => {
    it.each(['border: none', 'border-style: none', 'border-width: 0', 'border: 0', 'color: red; border : none;'])(
        'detects an explicit border reset in %s',
        (styleText) => {
            expect(hasExplicitNoBorder(styleText)).toBe(true);
        },
    );

    it.each(['', 'border: solid', 'border-width: 1px', 'border: 0.5px solid'])(
        'does not treat %s as an explicit border reset',
        (styleText) => {
            expect(hasExplicitNoBorder(styleText)).toBe(false);
        },
    );
});

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

    it('uses a visible box shadow when the positive border is not solid', () => {
        const style = createStyle({
            borderTopWidth: '2px',
            borderTopStyle: 'dotted',
            boxShadow: '0 0 0 2px black',
        });
        expect(hasVisibleBorder(document.createElement('button'), style)).toBe(true);
    });

    it('rejects a non-solid border without a visible box shadow', () => {
        const style = createStyle({ borderLeftWidth: '2px', borderLeftStyle: 'dashed' });
        expect(hasVisibleBorder(document.createElement('button'), style)).toBe(false);
    });
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
