import { describe, expect, it } from 'vitest';
import type { Finding } from '@contrast-lens/engine';
import { toDisplayFinding } from './types.js';

describe('toDisplayFinding', () => {
    it('carries over finding fields and captures the element markup', () => {
        const element = document.createElement('button');
        element.textContent = 'Save';
        const finding: Finding = {
            ruleId: 'button-no-border',
            severity: 'error',
            message: 'Button has no visible border.',
            hint: 'Add a border.',
            element,
        };

        const displayFinding = toDisplayFinding(finding, 'finding-0');

        expect(displayFinding).toEqual({
            id: 'finding-0',
            ruleId: 'button-no-border',
            severity: 'error',
            message: 'Button has no visible border.',
            hint: 'Add a border.',
            elementMarkup: '<button>Save</button>',
            element,
        });
    });
});
