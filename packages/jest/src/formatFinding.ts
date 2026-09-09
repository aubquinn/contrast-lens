import type { Finding } from "@contrast-lens/engine";

export function formatFinding(finding: Finding): string {
    const element = finding.element.outerHTML;
    const hint = finding.hint === undefined ? "" : `\nHint: ${finding.hint}`;

    return `${finding.ruleId} [${finding.severity}]\n${finding.message}${hint}\n${element}`;
}
