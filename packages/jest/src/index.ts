import { allRules, runRules } from "@contrast-lens/engine";
import type { Finding, Rule } from "@contrast-lens/engine";

declare module "expect" {
    interface Matchers<R> {
        toHaveNoViolations(): R;
    }

    interface AsymmetricMatchers {
        toHaveNoViolations(): void;
    }
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toHaveNoViolations(): R;
        }
    }
}

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

export { toHaveNoViolations } from "./matcher.js";
export type { ContrastLensMatchers } from "./matcher.js";
