export function hasVisibleBoxShadow(style: CSSStyleDeclaration): boolean {
    const boxShadow = style.boxShadow;

    if (!boxShadow || boxShadow === 'none') {
        return false;
    }

    const shadows = boxShadow.split(/,(?![^(]*\))/g).map((shadow) => shadow.trim());
    for (const shadow of shadows) {

        if (!shadow || shadow.includes('inset')) {
            continue;
        }

        const parts = shadow.split(/\s+/).filter(Boolean);

        if (parts.length < 4) {
            continue;
        }

        const [x, y, blur, spread] = parts;

        if (
            (x === '0' || x === '0px') &&
            (y === '0' || y === '0px') &&
            (blur === '0' || blur === '0px') &&
            parseFloat(spread) > 0
        ) {
            return true;
        }
    }

    return false;
}