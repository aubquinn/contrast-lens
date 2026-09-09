import { describe, expect, it } from 'vitest';
import { Severity } from '../../core/types';
import { getBorderWidthSeverity } from './getBorderWidthSeverity';

const createStyle = (values: Partial<CSSStyleDeclaration> = {}): CSSStyleDeclaration => values as CSSStyleDeclaration;

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

    it('returns a warning when any positive border is below the preferred width', () => {
        expect(
            getBorderWidthSeverity(
                createStyle({
                    borderTopWidth: '3px',
                    borderRightWidth: '1px',
                    borderBottomWidth: '4px',
                    borderLeftWidth: '2px',
                }),
            ),
        ).toBe(Severity.WARNING);
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
