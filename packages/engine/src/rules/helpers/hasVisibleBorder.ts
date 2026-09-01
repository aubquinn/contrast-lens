import { hasExplicitNoBorder } from './hasExplicitNoBoarder';

const RENDERED_BORDER_STYLES = new Set(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']);

export function hasVisibleBorder(element: Element, style: CSSStyleDeclaration): boolean {
    const styleText = (element.getAttribute('style') || '').toLowerCase();

    if (hasExplicitNoBorder(styleText)) {
        return false;
    }

    const top = parseFloat(style.borderTopWidth || '0');
    const right = parseFloat(style.borderRightWidth || '0');
    const bottom = parseFloat(style.borderBottomWidth || '0');
    const left = parseFloat(style.borderLeftWidth || '0');

    const hasAnyWidth = top > 0 || right > 0 || bottom > 0 || left > 0;

    if (!hasAnyWidth) {
        return false;
    }

    // Check shorthand borderStyle first
    if (style.borderStyle && RENDERED_BORDER_STYLES.has(style.borderStyle)) {
        return true;
    }

    // Fall back to checking individual border styles
    const borderTopStyle = style.borderTopStyle || '';
    const borderRightStyle = style.borderRightStyle || '';
    const borderBottomStyle = style.borderBottomStyle || '';
    const borderLeftStyle = style.borderLeftStyle || '';

    const hasVisibleStyle =
        RENDERED_BORDER_STYLES.has(borderTopStyle) ||
        RENDERED_BORDER_STYLES.has(borderRightStyle) ||
        RENDERED_BORDER_STYLES.has(borderBottomStyle) ||
        RENDERED_BORDER_STYLES.has(borderLeftStyle);

    return hasVisibleStyle;
}
