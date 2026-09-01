export const Severity = {
    WARNING: 'warning',
    ERROR: 'error',
} as const;

export type Severity = (typeof Severity)[keyof typeof Severity];

export type Finding = {
    ruleId: string;
    severity: Severity;
    message: string;
    element: Element;
    hint?: string;
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
