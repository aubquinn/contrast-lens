import { afterEach, describe, expect, it, vi } from 'vitest';
import { createContentScriptHandler } from './content.js';
import type { ContentScriptRequest, ContentScriptResponse, ScanResponse } from './messages.js';

const makeDocumentWithBorderlessButton = (): Document => {
    document.body.innerHTML = '<button id="save-button" style="border: none">Save</button>';
    return document;
};

describe('createContentScriptHandler', () => {
    it('scans the real DOM with the engine and returns plain, serializable findings', () => {
        const handler = createContentScriptHandler(makeDocumentWithBorderlessButton());

        const response = handler({ type: 'CONTRAST_LENS_SCAN' }) as ScanResponse;

        expect(response.findings).toHaveLength(1);
        const [finding] = response.findings;
        expect(finding.ruleId).toBe('button-no-border');
        expect(finding.severity).toBe('error');
        expect(finding.elementMarkup).toContain('id="save-button"');
        expect(finding).not.toHaveProperty('element');
        expect(JSON.parse(JSON.stringify(finding))).toEqual(finding);
    });

    it('highlights and unhighlights the scanned element by id', () => {
        const doc = makeDocumentWithBorderlessButton();
        const handler = createContentScriptHandler(doc);
        const { findings } = handler({ type: 'CONTRAST_LENS_SCAN' }) as ScanResponse;
        const [finding] = findings;

        handler({ type: 'CONTRAST_LENS_HIGHLIGHT', id: finding.id });

        expect(doc.querySelector('[data-contrast-lens-highlight]')).not.toBeNull();

        handler({ type: 'CONTRAST_LENS_UNHIGHLIGHT' });

        expect(doc.querySelector('[data-contrast-lens-highlight]')).toBeNull();
    });

    it('ignores a highlight request for an unknown id', () => {
        const handler = createContentScriptHandler(makeDocumentWithBorderlessButton());
        handler({ type: 'CONTRAST_LENS_SCAN' });

        handler({ type: 'CONTRAST_LENS_HIGHLIGHT', id: 'not-a-real-id' });

        expect(document.querySelector('[data-contrast-lens-highlight]')).toBeNull();
    });

    it('clears the previous highlight when a new scan runs', () => {
        const doc = makeDocumentWithBorderlessButton();
        const handler = createContentScriptHandler(doc);
        const { findings } = handler({ type: 'CONTRAST_LENS_SCAN' }) as ScanResponse;
        handler({ type: 'CONTRAST_LENS_HIGHLIGHT', id: findings[0].id });

        handler({ type: 'CONTRAST_LENS_SCAN' });

        expect(doc.querySelector('[data-contrast-lens-highlight]')).toBeNull();
    });
});

describe('content script wiring', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('registers a chrome.runtime.onMessage listener that delegates to the handler', async () => {
        type Listener = (
            message: ContentScriptRequest,
            sender: unknown,
            sendResponse: (response: ContentScriptResponse) => void,
        ) => void;
        const addListener = vi.fn<(listener: Listener) => void>();
        vi.stubGlobal('chrome', { runtime: { id: 'test-extension-id', onMessage: { addListener } } });
        vi.resetModules();

        await import('./content.js');

        expect(addListener).toHaveBeenCalledTimes(1);
        const listener = addListener.mock.calls[0][0];
        makeDocumentWithBorderlessButton();
        const sendResponse = vi.fn();

        listener({ type: 'CONTRAST_LENS_SCAN' }, {}, sendResponse);

        expect(sendResponse).toHaveBeenCalledWith(expect.objectContaining({ findings: expect.any(Array) }));
    });

    it('does not register a listener outside an extension context', async () => {
        vi.resetModules();

        await expect(import('./content.js')).resolves.toBeDefined();
    });
});
