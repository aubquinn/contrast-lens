import { describe, expect, it } from 'vitest';
import { Severity } from '../../core/types';
import { getBorderStyleSeverity } from './getBorderStyleSeverity';

const createStyle = (values: Partial<CSSStyleDeclaration> = {}): CSSStyleDeclaration => values as CSSStyleDeclaration;

describe('getBorderStyleSeverity', () => {
    it('accepts a solid border', () => {
        expect(getBorderStyleSeverity(createStyle({ borderStyle: 'solid' }))).toBeNull();
    });

    it.each(['dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'])(
        'warns for the less ideal %s border style',
        (borderStyle) => {
            expect(getBorderStyleSeverity(createStyle({ borderStyle }))).toBe(Severity.WARNING);
        },
    );

    it('checks individual border styles', () => {
        expect(getBorderStyleSeverity(createStyle({ borderLeftStyle: 'dashed' }))).toBe(Severity.WARNING);
    });

    it('returns an error when no rendered border style is present', () => {
        expect(getBorderStyleSeverity(createStyle({ borderStyle: 'none' }))).toBe(Severity.ERROR);
    });
});
