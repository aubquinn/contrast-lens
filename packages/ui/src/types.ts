import type { Finding, Severity } from '@contrast-lens/engine';

export type DisplayFinding = {
    id: string;
    ruleId: string;
    severity: Severity;
    message: string;
    hint?: string;
    elementMarkup: string;
    /** Present only when the finding's element lives in the same document as this UI (e.g. Storybook). */
    element?: Element;
};

export const toDisplayFinding = (finding: Finding, id: string): DisplayFinding => ({
    id,
    ruleId: finding.ruleId,
    severity: finding.severity,
    message: finding.message,
    hint: finding.hint,
    elementMarkup: finding.element.outerHTML,
    element: finding.element,
});
