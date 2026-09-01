import { describe, expect, it } from 'vitest';
import { runRules } from '../core';
import { buttonNoBorderRule } from './buttonNoBorderRule';

describe('buttonNoBorderRule', () => {
    it('returns an error for a button with no border', () => {
        document.body.innerHTML = `<button style="border: none">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'error',
        });
    });

    it('returns an error for a custom element with role=button and no visible border', () => {
        document.body.innerHTML = `<div role="button" style="border: none">Save</div>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'error',
        });
    });

    it('does not return a warning for a custom element with role=button and a visible border', () => {
        document.body.innerHTML = `<div role="button" style="border: 2px solid black">Save</div>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(0);
    });

    it('returns an error for a button with zero border width', () => {
        document.body.innerHTML = `<button style="border-width: 0; border-style: none">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]?.severity).toBe('error');
    });

    it('ignores hidden buttons without border', () => {
        document.body.innerHTML = `<button style="border: none; display: none">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(0);
    });

    it('does not return a warning for a button with a visible border', () => {
        document.body.innerHTML = `<button style="border: 2px solid black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(0);
    });

    it('does not return a warning or an error for a button with a transparent border', () => {
        document.body.innerHTML = `<button style="border: 2px solid transparent">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(0);
    });

    it('returns a warning for a button with dotted border', () => {
        document.body.innerHTML = `<button style="border: 2px dotted black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('returns a warning for a button with dashed border', () => {
        document.body.innerHTML = `<button style="border: 2px dashed black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('returns a warning for a button with double border', () => {
        document.body.innerHTML = `<button style="border: 4px double black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('returns a warning for a button with groove border', () => {
        document.body.innerHTML = `<button style="border: 2px groove black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('returns a warning for a button with ridge border', () => {
        document.body.innerHTML = `<button style="border: 2px ridge black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('returns a warning for a button with inset border', () => {
        document.body.innerHTML = `<button style="border: 2px inset black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('returns a warning for a button with outset border', () => {
        document.body.innerHTML = `<button style="border: 2px outset black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('returns an error for a button with hidden border', () => {
        document.body.innerHTML = `<button style="border: 2px hidden">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'error',
        });
    });

    it('returns a warning for a button with solid border but width less than 1px', () => {
        document.body.innerHTML = `<button style="border: 0.5px solid black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it('does not return a finding for a button with a visible solid border of 2px or more', () => {
        document.body.innerHTML = `<button style="border: 2px solid black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(0);
    });

    it('returns a warning for a button with solid border and width less than 2px', () => {
        document.body.innerHTML = `<button style="border: 1px solid black">Save</button>`;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'warning',
        });
    });

    it.each([
        [':hover', 'hover'],
        [':active', 'active'],
        [':focus', 'focus'],
        [':focus-visible', 'focus-visible'],
        [':disabled', 'disabled'],
        ['[aria-disabled="true"]', 'aria-disabled'],
    ])('returns an error when %s removes the border', (stateSelector, stateName) => {
        document.body.innerHTML = `
            <style>.state-button${stateSelector} { border: none; }</style>
            <button class="state-button" style="border: 2px solid transparent">Save</button>
        `;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'button-no-border',
            severity: 'error',
        });
        expect(findings[0]?.message).toContain(stateName);
    });

    it('detects a border removed by a nested forced-colors rule', () => {
        document.body.innerHTML = `
            <style>
                @media (forced-colors: active) {
                    .state-button:hover { border-width: 0; }
                }
            </style>
            <button class="state-button" style="border: 2px solid transparent">Save</button>
        `;

        const findings = runRules(document, [buttonNoBorderRule]);

        expect(findings[0]).toMatchObject({ severity: 'error' });
        expect(findings[0]?.message).toContain('hover');
    });

    it('does not report state rules that preserve the border', () => {
        document.body.innerHTML = `
            <style>.state-button:hover { border-color: Highlight; }</style>
            <button class="state-button" style="border: 2px solid transparent">Save</button>
        `;

        expect(runRules(document, [buttonNoBorderRule])).toHaveLength(0);
    });

    it('warns when a stylesheet blocks interaction-state inspection', () => {
        const element = document.body.appendChild(document.createElement('button'));
        element.style.border = '2px solid transparent';

        const blockedStyleSheet = {} as CSSStyleSheet;
        Object.defineProperty(blockedStyleSheet, 'cssRules', {
            get: () => {
                throw new DOMException('Blocked by the same-origin policy', 'SecurityError');
            },
        });
        const blockedDocument = {
            styleSheets: [blockedStyleSheet],
        } as unknown as Document;

        const findings = buttonNoBorderRule.evaluate(element, {
            root: document,
            doc: blockedDocument,
            win: window,
        });

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            severity: 'warning',
        });
        expect(findings[0]?.message).toContain('1 stylesheet was blocked');
        expect(findings[0]?.message).toContain('may not have been detected');
    });
});
