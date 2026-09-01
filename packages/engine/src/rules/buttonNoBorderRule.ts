import { Severity, type Finding, type Rule, type RuleContext } from '../core/types';
import { hasVisibleBorder } from './helpers/hasVisibleBorder';
import { getBorderWidthSeverity } from './helpers/getBorderWidthSeverity';
import { isElementVisible } from './helpers/isElementVisible';

export const buttonNoBorderRule: Rule = {
    id: 'button-no-border',
    selector:
        "button, input[type='button'], input[type='submit'], input[type='reset'], [role='button']:not(button):not(input)",
    evaluate: (element: Element, context: RuleContext): Finding[] => {
        const style = context.win.getComputedStyle(element);
        console.log('Evaluating buttonNoBorderRule for element:', element, 'with style:', style);

        if (!isElementVisible(element, style)) {
            return [];
        }

        if (!hasVisibleBorder(element, style)) {
            return [
                {
                    ruleId: 'button-no-border',
                    severity: Severity.ERROR,
                    message:
                        'Button controls should have a visible border in CSS so they remain distinguishable in high contrast mode.',
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
                    message:
                        'Button borders must be at least 2px wide for to remain distinguishable in high contrast mode.',
                    element,
                },
            ];
        }

        return [];
    },
};
