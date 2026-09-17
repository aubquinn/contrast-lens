import { describe, expect, it } from 'vitest';
import { runRules } from '../../core/index.js';
import { linkNoForcedColoursOptOutRule } from './linkNoForcedColoursOptOut.js';

describe('linkNoForcedColoursOptOutRule', () => {
    it('does not warn for a plain link', () => {
        document.body.innerHTML = `<a href="/settings">Settings</a>`;

        expect(runRules(document, [linkNoForcedColoursOptOutRule])).toHaveLength(0);
    });

    it('does not warn when the link only changes its color', () => {
        document.body.innerHTML = `<a href="/settings" style="color: red">Settings</a>`;

        expect(runRules(document, [linkNoForcedColoursOptOutRule])).toHaveLength(0);
    });

    it('does not warn when a forced-colors media query only sets a system color', () => {
        document.body.innerHTML = `
            <style>
                @media (forced-colors: active) {
                    a { color: LinkText; }
                }
            </style>
            <a href="/settings">Settings</a>
        `;

        expect(runRules(document, [linkNoForcedColoursOptOutRule])).toHaveLength(0);
    });

    it('ignores an anchor without an href, since it is not a real link', () => {
        document.body.innerHTML = `<a style="forced-color-adjust: none">Settings</a>`;

        expect(runRules(document, [linkNoForcedColoursOptOutRule])).toHaveLength(0);
    });

    it('ignores a hidden link that opts out', () => {
        document.body.innerHTML = `<a href="/settings" style="forced-color-adjust: none; display: none">Settings</a>`;

        expect(runRules(document, [linkNoForcedColoursOptOutRule])).toHaveLength(0);
    });

    it('returns an error for an inline forced-color-adjust: none', () => {
        document.body.innerHTML = `<a href="/settings" style="forced-color-adjust: none">Settings</a>`;

        const findings = runRules(document, [linkNoForcedColoursOptOutRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'link-no-forced-colours-opt-out',
            severity: 'error',
        });
    });

    it('returns an error for a stylesheet rule that sets forced-color-adjust: none', () => {
        document.body.innerHTML = `
            <style>.opt-out { forced-color-adjust: none; }</style>
            <a class="opt-out" href="/settings">Settings</a>
        `;

        const findings = runRules(document, [linkNoForcedColoursOptOutRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'link-no-forced-colours-opt-out',
            severity: 'error',
        });
    });

    it('returns an error when the opt-out is scoped inside a forced-colors media query', () => {
        document.body.innerHTML = `
            <style>
                @media (forced-colors: active) {
                    a { forced-color-adjust: none; }
                }
            </style>
            <a href="/settings">Settings</a>
        `;

        const findings = runRules(document, [linkNoForcedColoursOptOutRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'link-no-forced-colours-opt-out',
            severity: 'error',
        });
    });

    it('returns an error when the link inherits the opt-out from an ancestor', () => {
        document.body.innerHTML = `
            <nav style="forced-color-adjust: none">
                <a href="/settings">Settings</a>
            </nav>
        `;

        const findings = runRules(document, [linkNoForcedColoursOptOutRule]);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: 'link-no-forced-colours-opt-out',
            severity: 'error',
        });
        expect(findings[0]?.message).toContain('inherits');
    });

    it('does not flag the link when it overrides an ancestor opt-out back to auto', () => {
        document.body.innerHTML = `
            <nav style="forced-color-adjust: none">
                <a href="/settings" style="forced-color-adjust: auto">Settings</a>
            </nav>
        `;

        expect(runRules(document, [linkNoForcedColoursOptOutRule])).toHaveLength(0);
    });

    it('warns when a stylesheet blocks opt-out inspection', () => {
        const element = document.body.appendChild(document.createElement('a'));
        element.setAttribute('href', '/settings');

        const blockedStyleSheet = {} as CSSStyleSheet;
        Object.defineProperty(blockedStyleSheet, 'cssRules', {
            get: () => {
                throw new DOMException('Blocked by the same-origin policy', 'SecurityError');
            },
        });
        const blockedDocument = {
            styleSheets: [blockedStyleSheet],
        } as unknown as Document;

        const findings = linkNoForcedColoursOptOutRule.evaluate(element, {
            root: document,
            doc: blockedDocument,
            win: window,
        });

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({ severity: 'warning' });
        expect(findings[0]?.message).toContain('1 stylesheet was blocked');
    });
});
