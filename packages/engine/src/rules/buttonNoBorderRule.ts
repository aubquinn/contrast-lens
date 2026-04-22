import type { Finding, Rule, RuleContext } from "../core/types";

const visibleBorderStyles = new Set([
  "solid",
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

function getBorderWidthSeverity(style: CSSStyleDeclaration): "error" | "warning" | null {
  const top = parseFloat(style.borderTopWidth || "0");
  const right = parseFloat(style.borderRightWidth || "0");
  const bottom = parseFloat(style.borderBottomWidth || "0");
  const left = parseFloat(style.borderLeftWidth || "0");

  const widths = [top, right, bottom, left].filter(w => w > 0);
  if (widths.length === 0) return null;

  const minWidth = Math.min(...widths);

  if (minWidth < 1) return "error";
  if (minWidth < 2) return "warning";
  return null;
}

export const buttonNoBorderRule: Rule = {
  id: "button-no-border",
  selector: "button, input[type='button'], input[type='submit'], input[type='reset']",
  evaluate: (element: Element, context: RuleContext): Finding[] => {
    const style = context.win.getComputedStyle(element);

    if (!hasVisibleBorder(element, style)) {
      return [
        {
          ruleId: "button-no-border",
          severity: "error",
          message:
            "Button controls should have a visible border in CSS so they remain distinguishable in high contrast mode.",
          element,
        },
      ];
    }

    const widthSeverity = getBorderWidthSeverity(style);
    if (widthSeverity) {
      return [
        {
          ruleId: "button-no-border",
          severity: widthSeverity,
          message:
            widthSeverity === "error"
              ? "Button borders must be at least 1px wide for accessibility."
              : "Button borders should be at least 2px wide for better visibility in high contrast mode.",
          element,
        },
      ];
    }

    return [];
  },
};
