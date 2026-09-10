import { expect } from '@jest/globals';
import { runAllRules, runRules, buttonNoBorderRule, type Finding } from '@contrast-lens/engine';
import { contrastLens, type ContrastLensOptions } from '@contrast-lens/jest';
import { toHaveNoViolations } from '@contrast-lens/jest/matchers';
import type { ContrastLensPanel } from '@contrast-lens/storybook-addon';
import '@contrast-lens/jest/extend-expect';

const options: ContrastLensOptions = { includeWarnings: false };
const findings: Finding[] = runAllRules(document.body);
runRules(document.body, [buttonNoBorderRule]);
expect(findings).toHaveNoViolations();
expect(contrastLens(document.body, options)).toHaveNoViolations();
expect.extend({ toHaveNoViolations });
export type Panel = ReturnType<typeof ContrastLensPanel>;
