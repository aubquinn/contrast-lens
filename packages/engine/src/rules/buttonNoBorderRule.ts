import { Severity, type Finding, type Rule, type RuleContext } from '../core/types';
import { getBorderStyleSeverity } from './helpers/getBorderStyleSeverity';
import { getBorderWidthSeverity } from './helpers/getBorderWidthSeverity';
import { hasVisibleBorder } from './helpers/hasVisibleBorder';
import { isElementVisible } from './helpers/isElementVisible';

const BORDER_HINT = `Keep a 2px transparent border, or restore the border and interaction states in forced-colors mode:
.button { border: 2px solid transparent; }
@media (forced-colors: active) {
  .button { border-color: ButtonBorder; color: ButtonText; background: ButtonFace; }
  .button:hover, .button:active { border-color: Highlight; }
  .button:focus-visible { outline: 2px solid Highlight; outline-offset: 2px; }
  .button:disabled, .button[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
}`;

export const buttonNoBorderRule: Rule = {
    id: 'button-no-border',
    selector:
        "button, input[type='button'], input[type='submit'], input[type='reset'], [role='button']:not(button):not(input)",
    evaluate: (element: Element, context: RuleContext): Finding[] => {
        const style = context.win.getComputedStyle(element);

        if (!isElementVisible(element, style)) {
            return [];
        }

        if (!hasVisibleBorder(element, style)) {
            return [
                {
                    ruleId: 'button-no-border',
                    severity: Severity.ERROR,
                    hint: BORDER_HINT,
                    message:
                        'Button controls should have a visible border in CSS so they remain distinguishable in forced-colors mode.',
                    element,
                },
            ];
        }

        const widthSeverity = getBorderWidthSeverity(style);
        if (widthSeverity) {
            return [
                {
                    ruleId: 'button-no-border',
                    severity: widthSeverity,
                    hint: BORDER_HINT,
                    message:
                        'Button borders should be at least 2px wide so they remain distinguishable in forced-colors mode.',
                    element,
                },
            ];
        }

        const styleSeverity = getBorderStyleSeverity(style);
        if (styleSeverity) {
            return [
                {
                    ruleId: 'button-no-border',
                    severity: styleSeverity,
                    hint: BORDER_HINT,
                    message:
                        'Solid button borders are preferred because other border styles can be less distinct in forced-colors mode.',
                    element,
                },
            ];
        }

        return [];
    },
};
