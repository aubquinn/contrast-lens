import { runAllRules } from '@contrast-lens/engine';
import { createElementOverlay, toDisplayFinding } from '@contrast-lens/ui';
import type { ContentScriptRequest, ContentScriptResponse } from './messages.js';

/**
 * Runs the engine against `root`, replies with plain data (no live `Element`s can cross a
 * `chrome.runtime` message), and keeps the live elements in `elementsById` so later
 * highlight/unhighlight requests can find them by the same `id`.
 */
export const createContentScriptHandler = (root: ParentNode = document) => {
    let elementsById = new Map<string, Element>();
    let removeOverlay: (() => void) | null = null;

    const clearHighlight = () => {
        removeOverlay?.();
        removeOverlay = null;
    };

    const scan = (): ContentScriptResponse => {
        clearHighlight();
        elementsById = new Map();

        const findings = runAllRules(root).map((finding, index) => {
            const id = `finding-${index}`;
            elementsById.set(id, finding.element);
            const displayFinding = toDisplayFinding(finding, id);
            delete displayFinding.element;
            return displayFinding;
        });

        return { findings };
    };

    const highlight = (id: string) => {
        clearHighlight();
        const element = elementsById.get(id);

        if (element) {
            removeOverlay = createElementOverlay(element);
        }
    };

    return (message: ContentScriptRequest): ContentScriptResponse => {
        switch (message.type) {
            case 'CONTRAST_LENS_SCAN':
                return scan();
            case 'CONTRAST_LENS_HIGHLIGHT':
                highlight(message.id);
                return { ok: true };
            case 'CONTRAST_LENS_UNHIGHLIGHT':
                clearHighlight();
                return { ok: true };
        }
    };
};

if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
    const handleMessage = createContentScriptHandler();

    type MessageListener = (
        message: ContentScriptRequest,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: ContentScriptResponse) => void,
    ) => void;

    const listener: MessageListener = (message, _sender, sendResponse) => {
        sendResponse(handleMessage(message));
    };

    chrome.runtime.onMessage.addListener(listener);
}
