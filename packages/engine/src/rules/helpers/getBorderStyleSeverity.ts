import { Severity } from '../../core/types';

const IDEAL_BORDER_STYLE = 'solid';
const LESS_IDEAL_BORDER_STYLES = new Set(['dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']);

export function getBorderStyleSeverity(style: CSSStyleDeclaration): Severity | null {
    const borderStyles = [
        style.borderStyle,
        style.borderTopStyle,
        style.borderRightStyle,
        style.borderBottomStyle,
        style.borderLeftStyle,
    ].filter(Boolean);

    if (borderStyles.some((borderStyle) => LESS_IDEAL_BORDER_STYLES.has(borderStyle))) {
        return Severity.WARNING;
    }

    return borderStyles.includes(IDEAL_BORDER_STYLE) ? null : Severity.ERROR;
}
