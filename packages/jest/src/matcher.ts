import type { Finding } from '@contrast-lens/engine';
import type { MatcherContext } from 'expect';
import { formatFinding } from './formatFinding.js';

export type ContrastLensMatchers = {
    toHaveNoViolations(): unknown;
};

export function toHaveNoViolations(
    this: MatcherContext,
    received: Finding[],
): { pass: boolean; message: () => string } {
    if (!Array.isArray(received)) {
        throw new TypeError('toHaveNoViolations expects the received value to be a Finding[].');
    }

    const pass = received.length === 0;
    const hint = this.utils.matcherHint('toHaveNoViolations', 'received', '', {
        isNot: this.isNot,
    });
    const details = received.map(formatFinding).join('\n\n');

    return {
        pass,
        message: () => {
            if (pass) {
                return `${hint}\n\nExpected the DOM to contain at least one Contrast Lens finding.`;
            }

            return `${hint}\n\nExpected the DOM to have no Contrast Lens findings.\n\n${details}`;
        },
    };
}
