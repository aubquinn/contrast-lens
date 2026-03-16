import type { Finding, Rule } from "../core/types";

function isNativeButtonLike(el: Element): boolean {
  const tag = el.tagName.toLowerCase();

  if (tag === "button") {
    return true;
  }

  if (tag === "input") {
    const type = (el.getAttribute("type") || "").toLowerCase();
    return type === "button" || type === "submit" || type === "reset";
  }

  return false;
}

export const roleButtonUsedRule: Rule = {
  id: "role-button-used",
  selector: `[role="button"]`,
  evaluate: (element): Finding[] => {
    if (isNativeButtonLike(element)) {
      return [];
    }

    return [
      {
        ruleId: "role-button-used",
        severity: "warning",
        message:
          'Custom button uses role="button". Prefer a native <button> because custom controls are more likely to need extra forced-colors styling.',
        element,
      },
    ];
  },
};
