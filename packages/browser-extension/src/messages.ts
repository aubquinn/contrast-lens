import type { DisplayFinding } from '@contrast-lens/ui';

/** A `DisplayFinding` with its live `Element` stripped so it can cross a `chrome.runtime` message. */
export type SerializedFinding = Omit<DisplayFinding, 'element'>;

export type ScanRequest = { type: 'CONTRAST_LENS_SCAN' };
export type ScanResponse = { findings: SerializedFinding[] };

export type HighlightRequest = { type: 'CONTRAST_LENS_HIGHLIGHT'; id: string };
export type UnhighlightRequest = { type: 'CONTRAST_LENS_UNHIGHLIGHT' };
export type HighlightResponse = { ok: true };

export type ContentScriptRequest = ScanRequest | HighlightRequest | UnhighlightRequest;
export type ContentScriptResponse = ScanResponse | HighlightResponse;
