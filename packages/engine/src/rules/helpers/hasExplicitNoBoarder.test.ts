import { describe, expect, it } from 'vitest';
import { hasExplicitNoBorder } from './hasExplicitNoBoarder';

describe('hasExplicitNoBorder', () => {
    it.each(['border: none', 'border-style: none', 'border-width: 0', 'border: 0', 'color: red; border : none;'])(
        'detects an explicit border reset in %s',
        (styleText) => {
            expect(hasExplicitNoBorder(styleText)).toBe(true);
        },
    );

    it.each(['', 'border: solid', 'border-width: 1px', 'border: 0.5px solid'])(
        'does not treat %s as an explicit border reset',
        (styleText) => {
            expect(hasExplicitNoBorder(styleText)).toBe(false);
        },
    );
});
