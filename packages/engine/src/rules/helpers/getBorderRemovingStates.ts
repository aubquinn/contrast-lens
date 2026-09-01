import { hasExplicitNoBorder } from './hasExplicitNoBoarder';

const STATE_PATTERNS = [
    { name: 'focus-visible', pattern: /:focus-visible\b/g },
    { name: 'hover', pattern: /:hover\b/g },
    { name: 'active', pattern: /:active\b/g },
    { name: 'focus', pattern: /:focus(?![-\w])/g },
    { name: 'disabled', pattern: /:disabled\b/g },
    { name: 'aria-disabled', pattern: /\[aria-disabled\s*=\s*["']?true["']?\]/gi },
] as const;

function getNestedRules(rule: CSSRule): CSSRuleList | null {
    try {
        return 'cssRules' in rule ? (rule.cssRules as CSSRuleList) : null;
    } catch {
        return null;
    }
}

function selectorMatchesElement(selector: string, element: Element): boolean {
    try {
        return element.matches(selector);
    } catch {
        return false;
    }
}

function collectRemovingStates(rules: CSSRuleList, element: Element, states: Set<string>): void {
    for (const rule of rules) {
        if ('selectorText' in rule && 'style' in rule) {
            const styleRule = rule as CSSStyleRule;
            const styleText = styleRule.style.cssText.toLowerCase();

            if (!styleText) {
                continue;
            }

            for (const selector of styleRule.selectorText.split(',')) {
                const selectorStates = STATE_PATTERNS.filter(({ pattern }) => {
                    pattern.lastIndex = 0;
                    return pattern.test(selector);
                });

                if (selectorStates.length === 0) {
                    continue;
                }

                const baseSelector = STATE_PATTERNS.reduce((value, { pattern }) => {
                    pattern.lastIndex = 0;
                    return value.replace(pattern, '');
                }, selector).trim();

                if (!baseSelector || !selectorMatchesElement(baseSelector, element)) {
                    continue;
                }

                const removesBorder = hasExplicitNoBorder(styleText) || styleRule.style.borderStyle === 'hidden';

                if (removesBorder) {
                    selectorStates.forEach(({ name }) => states.add(name));
                }
            }

            continue;
        }

        const nestedRules = getNestedRules(rule);
        if (nestedRules) {
            collectRemovingStates(nestedRules, element, states);
        }
    }
}

export type BorderStateInspection = {
    states: string[];
    blockedStyleSheetCount: number;
};

export function getBorderRemovingStates(element: Element, doc: Document): BorderStateInspection {
    const states = new Set<string>();
    let blockedStyleSheetCount = 0;

    for (const styleSheet of doc.styleSheets) {
        try {
            collectRemovingStates(styleSheet.cssRules, element, states);
        } catch {
            blockedStyleSheetCount += 1;
        }
    }

    return { states: [...states], blockedStyleSheetCount };
}
