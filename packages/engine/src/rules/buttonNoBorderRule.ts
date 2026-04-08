import type { Finding, Rule, RuleContext } from "../core/types";

const visibleBorderStyles = new Set([
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
]);

function hasExplicitNoBorder(styleText: string): boolean {
  return /\bborder\s*:\s*none\b/.test(styleText) ||
    /\bborder-style\s*:\s*none\b/.test(styleText) ||
    /\bborder-width\s*:\s*0\b/.test(styleText) ||
    /\bborder\s*:\s*0\b/.test(styleText);
}

function hasVisibleBorder(element: Element, style: CSSStyleDeclaration): boolean {
  const styleText = (element.getAttribute("style") || "").toLowerCase();
  if (hasExplicitNoBorder(styleText)) {
    return false;
  }

  const top = parseFloat(style.borderTopWidth || "0");
  const right = parseFloat(style.borderRightWidth || "0");
  const bottom = parseFloat(style.borderBottomWidth || "0");
  const left = parseFloat(style.borderLeftWidth || "0");

  const hasAnyWidth = top > 0 || right > 0 || bottom > 0 || left > 0;
  return hasAnyWidth && visibleBorderStyles.has(style.borderStyle);
}

export const buttonNoBorderRule: Rule = {
  id: "button-no-border",
  selector: "button, input[type='button'], input[type='submit'], input[type='reset']",
  evaluate: (element: Element, context: RuleContext): Finding[] => {
    const style = context.win.getComputedStyle(element);

    if (hasVisibleBorder(element, style)) {
      return [];
    }

    return [
      {
        ruleId: "button-no-border",
        severity: "error",
        message:
          "Button controls should have a visible border in CSS so they remain distinguishable in high contrast mode.",
        element,
      },
    ];
  },
};
