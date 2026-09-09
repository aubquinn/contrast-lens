declare module 'expect' {
    interface Matchers<R> {
        toHaveNoViolations(): R;
    }

    interface AsymmetricMatchers {
        toHaveNoViolations(): void;
    }
}

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveNoViolations(): R;
        }
    }
}

export {};
