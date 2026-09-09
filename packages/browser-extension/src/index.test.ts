import { describe, expect, it } from 'vitest';
import { allRules, runAllRules, runRules } from './index.js';

describe('browser-extension entry point', () => {
    it("re-exports the engine's rule-running API", () => {
        expect(runAllRules).toBeTypeOf('function');
        expect(runRules).toBeTypeOf('function');
        expect(allRules.length).toBeGreaterThan(0);
    });
});
