import { Severity } from '../../core/types';

const MINIMUM_BORDER_WIDTH_PX = 2;
const BORDER_WIDTH_TOLERANCE_PX = 0.001;

export function getBorderWidthSeverity(style: CSSStyleDeclaration): Severity | null {
    const top = parseFloat(style.borderTopWidth || '0');
    const right = parseFloat(style.borderRightWidth || '0');
    const bottom = parseFloat(style.borderBottomWidth || '0');
    const left = parseFloat(style.borderLeftWidth || '0');

    const widths = [top, right, bottom, left].filter((w) => w > 0);

    if (widths.length === 0) {
        return null;
    }

    const minWidth = Math.min(...widths);

    if (minWidth + BORDER_WIDTH_TOLERANCE_PX < MINIMUM_BORDER_WIDTH_PX) {
        return Severity.WARNING;
    }

    return null;
}
