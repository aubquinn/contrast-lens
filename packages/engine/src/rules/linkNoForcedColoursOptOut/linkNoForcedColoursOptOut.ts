import { Severity, type Finding, type Rule, type RuleContext } from '../../core/types.js';
import { isElementVisible } from '../buttonNoBorderRule/helpers/isElementVisible.js';
import { getForcedColorAdjustOptOut } from './helpers/getForcedColorAdjustOptOut.js';

const HINT = `Let the browser apply its native Forced Colors link treatment instead of overriding it:
a {
  color: var(--brand-link);
}

/* Only if every color and interaction state is deliberately re-implemented with system colors */
@media (forced-colors: active) {
  a:visited { color: LinkText; }
}`;

export const linkNoForcedColoursOptOutRule: Rule = {
    id: 'link-no-forced-colours-opt-out',
    selector: 'a[href]',
    evaluate: (element: Element, context: RuleContext): Finding[] => {
        const style = context.win.getComputedStyle(element);

        if (!isElementVisible(element, style)) {
            return [];
        }

        const inspection = getForcedColorAdjustOptOut(element, context.doc);
        const findings: Finding[] = [];

        if (inspection.optedOut) {
            findings.push({
                ruleId: 'link-no-forced-colours-opt-out',
                severity: Severity.ERROR,
                hint: HINT,
                message:
                    'This link sets forced-color-adjust: none, which stops the browser from applying its native Forced Colors link treatment (for example, the system LinkText color).',
                element,
            });
        } else if (style.getPropertyValue('forced-color-adjust').trim().toLowerCase() === 'none') {
            findings.push({
                ruleId: 'link-no-forced-colours-opt-out',
                severity: Severity.ERROR,
                hint: HINT,
                message:
                    'This link inherits forced-color-adjust: none from an ancestor, which stops the browser from applying its native Forced Colors link treatment.',
                element,
            });
        }

        if (inspection.blockedStyleSheetCount > 0) {
            const sheetLabel = inspection.blockedStyleSheetCount === 1 ? 'stylesheet was' : 'stylesheets were';
            findings.push({
                ruleId: 'link-no-forced-colours-opt-out',
                severity: Severity.WARNING,
                hint: 'Review the link manually or make the stylesheet same-origin so its CSS rules can be inspected.',
                message: `${inspection.blockedStyleSheetCount} ${sheetLabel} blocked from inspection. A forced-color-adjust: none opt-out may not have been detected.`,
                element,
            });
        }

        return findings;
    },
};
