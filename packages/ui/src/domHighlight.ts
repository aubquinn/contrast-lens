/**
 * Draws a fixed-position red outline over `element` that tracks its position on scroll/resize,
 * and returns a function that removes the overlay and its listeners.
 */
export const createElementOverlay = (element: Element): (() => void) => {
    const ownerDocument = element.ownerDocument;
    const ownerWindow = ownerDocument.defaultView;
    const overlayGap = 4;
    const overlayBorderWidth = 4;
    const overlayOffset = overlayGap + overlayBorderWidth;

    const overlay = ownerDocument.createElement('div');
    overlay.setAttribute('data-contrast-lens-highlight', 'true');
    Object.assign(overlay.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '2147483647',
        border: `${overlayBorderWidth}px solid red`,
        boxSizing: 'border-box',
        background: 'transparent',
    });

    const positionOverlay = () => {
        if (!element.isConnected) {
            removeOverlay();
            return;
        }

        const rect = element.getBoundingClientRect();
        overlay.style.top = `${rect.top - overlayOffset}px`;
        overlay.style.left = `${rect.left - overlayOffset}px`;
        overlay.style.width = `${rect.width + overlayOffset * 2}px`;
        overlay.style.height = `${rect.height + overlayOffset * 2}px`;
    };

    const resizeObserver = ownerWindow?.ResizeObserver ? new ownerWindow.ResizeObserver(positionOverlay) : null;

    function removeOverlay() {
        ownerWindow?.removeEventListener('resize', positionOverlay);
        ownerWindow?.removeEventListener('scroll', positionOverlay, true);
        resizeObserver?.disconnect();
        overlay.remove();
    }

    ownerDocument.body.appendChild(overlay);
    ownerWindow?.addEventListener('resize', positionOverlay);
    ownerWindow?.addEventListener('scroll', positionOverlay, true);
    resizeObserver?.observe(element);

    positionOverlay();
    ownerWindow?.requestAnimationFrame(positionOverlay);

    return removeOverlay;
};
