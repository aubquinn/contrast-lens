declare module "expect" {
    interface Matchers<R> {
        toHaveNoViolations(): R;
    }

    interface AsymmetricMatchers {
        toHaveNoViolations(): void;
    }
}

export { };
