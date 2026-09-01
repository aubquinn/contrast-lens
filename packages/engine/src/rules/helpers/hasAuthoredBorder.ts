const BORDER_DECLARATION_PATTERN = /(?:^|;)\s*border(?:-(?:top|right|bottom|left))?(?:-(?:width|style|color))?\s*:/i;

function declaresBorder(style: CSSStyleDeclaration): boolean {
    return BORDER_DECLARATION_PATTERN.test(style.cssText);
}

function matchesSelector(element: Element, selector: string): boolean {
    try {
        return element.matches(selector);
    } catch {
        return false;
    }
}

function rulesDeclareBorder(rules: CSSRuleList, element: Element): boolean {
    for (const rule of rules) {
        if ('selectorText' in rule && 'style' in rule) {
            const styleRule = rule as CSSStyleRule;
            if (
                declaresBorder(styleRule.style) &&
                styleRule.selectorText.split(',').some((selector) => matchesSelector(element, selector.trim()))
            ) {
                return true;
            }
            continue;
        }

        try {
            if ('cssRules' in rule && rulesDeclareBorder(rule.cssRules as CSSRuleList, element)) {
                return true;
            }
        } catch {
            // Blocked stylesheets are reported by interaction-state inspection.
        }
    }

    return false;
}

export function hasAuthoredBorder(element: Element, doc: Document): boolean {
    const inlineStyle = element.getAttribute('style');
    if (inlineStyle && BORDER_DECLARATION_PATTERN.test(inlineStyle)) {
        return true;
    }

    if ('style' in element && declaresBorder((element as HTMLElement).style)) {
        return true;
    }

    for (const styleSheet of doc.styleSheets) {
        try {
            if (rulesDeclareBorder(styleSheet.cssRules, element)) {
                return true;
            }
        } catch {
            // Blocked stylesheets are reported by interaction-state inspection.
        }
    }

    return false;
}
