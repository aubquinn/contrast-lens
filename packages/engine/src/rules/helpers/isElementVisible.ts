export function isElementVisible(element: Element, style: CSSStyleDeclaration): boolean {
    if (!element.isConnected) {
        return false;
    }
    if (element.hasAttribute('hidden')) {
        return false;
    }
    if (element.getAttribute('aria-hidden') === 'true') {
        return false;
    }
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
    }
    return true;
}