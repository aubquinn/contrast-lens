import { hasExplicitNoBorder } from "./hasExplicitNoBoarder";
import { hasVisibleBoxShadow } from "./hasVisibleBoxShadow";

export function hasVisibleBorder(element: Element, style: CSSStyleDeclaration): boolean {
    const styleText = (element.getAttribute('style') || '').toLowerCase();

    if (hasExplicitNoBorder(styleText)) {
        return false;
    }

    const visibleBorderStyles = new Set(['solid']);

    const top = parseFloat(style.borderTopWidth || '0');
    const right = parseFloat(style.borderRightWidth || '0');
    const bottom = parseFloat(style.borderBottomWidth || '0');
    const left = parseFloat(style.borderLeftWidth || '0');

    const hasAnyWidth = top > 0 || right > 0 || bottom > 0 || left > 0;

    if (!hasAnyWidth) {
        return false;
    }

    // Check shorthand borderStyle first
    if (style.borderStyle && visibleBorderStyles.has(style.borderStyle)) {
        return true;
    }

    // Fall back to checking individual border styles
    const borderTopStyle = style.borderTopStyle || '';
    const borderRightStyle = style.borderRightStyle || '';
    const borderBottomStyle = style.borderBottomStyle || '';
    const borderLeftStyle = style.borderLeftStyle || '';

    const hasVisibleStyle =
        visibleBorderStyles.has(borderTopStyle) ||
        visibleBorderStyles.has(borderRightStyle) ||
        visibleBorderStyles.has(borderBottomStyle) ||
        visibleBorderStyles.has(borderLeftStyle);

    return hasVisibleStyle || hasVisibleBoxShadow(style);
}