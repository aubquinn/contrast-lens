import { allRules, runRules } from "@contrast-lens/engine";
import type { Finding, Rule } from "@contrast-lens/engine";

export type ContrastLensOptions = {
    rules?: Rule[];
    includeWarnings?: boolean;
};

export function contrastLens(
    root: ParentNode,
    options: ContrastLensOptions = {},
): Finding[] {
    const findings = runRules(root, options.rules ?? allRules);

    if (options.includeWarnings === false) {
        return findings.filter((finding) => finding.severity === "error");
    }

    return findings;
}

export { toHaveNoViolations } from "./matcher";
export type { ContrastLensMatchers } from "./matcher";
