export type Severity = "warning" | "error";

export type Finding = {
  ruleId: string;
  severity: Severity;
  message: string;
  element: Element;
};

export type RuleContext = {
  root: ParentNode;
  doc: Document;
  win: Window;
};

export type Rule = {
  id: string;
  selector: string;
  evaluate: (element: Element, context: RuleContext) => Finding[];
};
