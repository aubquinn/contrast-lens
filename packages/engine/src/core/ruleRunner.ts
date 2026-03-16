import type { Finding, Rule, RuleContext } from "./types";

export function runRules(root: ParentNode, rules: Rule[]): Finding[] {
  const doc = root instanceof Document ? root : root.ownerDocument;

  if (!doc) {
    throw new Error("runRules: could not resolve ownerDocument from root.");
  }

  const win = doc.defaultView;

  if (!win) {
    throw new Error("runRules: could not resolve defaultView from document.");
  }

  const context: RuleContext = {
    root,
    doc,
    win,
  };

  const findings: Finding[] = [];

  for (const rule of rules) {
    const elements = root.querySelectorAll(rule.selector);

    for (const element of elements) {
      findings.push(...rule.evaluate(element, context));
    }
  }

  return findings;
}
