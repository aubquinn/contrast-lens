import type { MatcherContext } from 'expect';

export const matcherContext: MatcherContext = {
    assertionCalls: 0,
    currentConcurrentTestName: undefined,
    currentTestIdentity: undefined,
    currentTestName: undefined,
    error: undefined,
    expand: false,
    expectedAssertionsNumber: null,
    expectedAssertionsNumberError: undefined,
    isExpectingAssertions: false,
    isExpectingAssertionsError: undefined,
    isNot: false,
    numPassingAsserts: 0,
    promise: undefined,
    suppressedErrors: [],
    testPath: undefined,
    customTesters: [],
    dontThrow: () => undefined,
    equals: (received, expected) => Object.is(received, expected),
    utils: {
        matcherHint: () => 'expect(received).toHaveNoViolations()',
    } as unknown as MatcherContext['utils'],
};
