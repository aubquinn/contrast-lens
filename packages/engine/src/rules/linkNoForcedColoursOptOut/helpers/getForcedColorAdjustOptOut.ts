function stylesOptOut(style: CSSStyleDeclaration): boolean {
    return style.getPropertyValue('forced-color-adjust').trim().toLowerCase() === 'none';
}

function matchesSelector(element: Element, selector: string): boolean {
    try {
        return element.matches(selector);
    } catch {
        return false;
    }
}

function rulesContainOptOut(rules: CSSRuleList, element: Element): boolean {
    for (const rule of rules) {
        if ('selectorText' in rule && 'style' in rule) {
            const styleRule = rule as CSSStyleRule;
            if (
                stylesOptOut(styleRule.style) &&
                styleRule.selectorText.split(',').some((selector) => matchesSelector(element, selector.trim()))
            ) {
                return true;
            }
            continue;
        }

        try {
            if ('cssRules' in rule && rulesContainOptOut(rule.cssRules as CSSRuleList, element)) {
                return true;
            }
        } catch {
            // Blocked stylesheets are reported by getForcedColorAdjustOptOut.
        }
    }

    return false;
}

export type ForcedColorAdjustInspection = {
    optedOut: boolean;
    blockedStyleSheetCount: number;
};

// Ignores whether an enclosing @media/@supports condition currently matches, since the riskiest
// pattern scopes the opt-out inside `@media (forced-colors: active)` so it only fires once active.
export function getForcedColorAdjustOptOut(element: Element, doc: Document): ForcedColorAdjustInspection {
    if ('style' in element && stylesOptOut((element as HTMLElement).style)) {
        return { optedOut: true, blockedStyleSheetCount: 0 };
    }

    let optedOut = false;
    let blockedStyleSheetCount = 0;

    for (const styleSheet of doc.styleSheets) {
        try {
            if (rulesContainOptOut(styleSheet.cssRules, element)) {
                optedOut = true;
            }
        } catch {
            blockedStyleSheetCount += 1;
        }
    }

    return { optedOut, blockedStyleSheetCount };
}
