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

function hasVisibleBoxShadow(style: CSSStyleDeclaration): boolean {
  const boxShadow = style.boxShadow;
  if (!boxShadow || boxShadow === "none") return false;

  const shadows = boxShadow.split(/,(?![^(]*\))/g).map((shadow) => shadow.trim());
  for (const shadow of shadows) {
    if (!shadow || shadow.includes("inset")) continue;

    const parts = shadow.split(/\s+/).filter(Boolean);
    if (parts.length < 4) continue;

    const [x, y, blur, spread] = parts;
    if (
      (x === "0" || x === "0px") &&
      (y === "0" || y === "0px") &&
      (blur === "0" || blur === "0px") &&
      parseFloat(spread) > 0
    ) {
      return true;
    }
  }

  return false;
}

function isElementVisible(element: Element, style: CSSStyleDeclaration): boolean {
  if (!element.isConnected) return false;
  if (element.hasAttribute("hidden")) return false;
  if (element.getAttribute("aria-hidden") === "true") return false;
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }
  return true;
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
  if (!hasAnyWidth) {
    return false;
  }

  // Check shorthand borderStyle first
  if (style.borderStyle && visibleBorderStyles.has(style.borderStyle)) {
    return true;
  }

  // Fall back to checking individual border styles
  const borderTopStyle = style.borderTopStyle || "";
  const borderRightStyle = style.borderRightStyle || "";
  const borderBottomStyle = style.borderBottomStyle || "";
  const borderLeftStyle = style.borderLeftStyle || "";
  
  const hasVisibleStyle = 
    visibleBorderStyles.has(borderTopStyle) ||
    visibleBorderStyles.has(borderRightStyle) ||
    visibleBorderStyles.has(borderBottomStyle) ||
    visibleBorderStyles.has(borderLeftStyle);
  
  return hasVisibleStyle || hasVisibleBoxShadow(style);
}

function getBorderWidthSeverity(style: CSSStyleDeclaration): "error" | "warning" | null {
  const top = parseFloat(style.borderTopWidth || "0");
  const right = parseFloat(style.borderRightWidth || "0");
  const bottom = parseFloat(style.borderBottomWidth || "0");
  const left = parseFloat(style.borderLeftWidth || "0");

  const widths = [top, right, bottom, left].filter((w) => w > 0);
  if (widths.length === 0) return null;

  const minWidth = Math.min(...widths);
  const tolerance = 0.001;

  if (minWidth + tolerance < 2) return "error";
  return null;
}

export const buttonNoBorderRule: Rule = {
  id: "button-no-border",
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
          message: "Button borders must be at least 2px wide for accessibility.",
          element,
        },
      ];
    }

    return [];
  },
};
