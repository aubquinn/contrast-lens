import { expect, test } from '@jest/globals';
import { allRules, buttonNoBorderRule, runAllRules, runRules } from '@contrast-lens/engine';
import { contrastLens } from '@contrast-lens/jest';
import { toHaveNoViolations } from '@contrast-lens/jest/matchers';
import '@contrast-lens/jest/extend-expect';

test('packed engine and Jest exports scan rendered DOM and register matchers', () => {
    document.body.innerHTML = '<button style="border: 0">No border</button>';
    expect(allRules).toContain(buttonNoBorderRule);
    expect(runAllRules(document.body)).toEqual(runRules(document.body, [buttonNoBorderRule]));
    const findings = contrastLens(document.body);
    expect(findings).toEqual(expect.arrayContaining([expect.objectContaining({ ruleId: 'button-no-border' })]));
    expect(() => expect(findings).toHaveNoViolations()).toThrow('button-no-border');
    expect(toHaveNoViolations).toBeInstanceOf(Function);

    document.body.innerHTML = '<button style="border: 2px solid transparent">Border</button>';
    expect(contrastLens(document.body)).toHaveNoViolations();
});
