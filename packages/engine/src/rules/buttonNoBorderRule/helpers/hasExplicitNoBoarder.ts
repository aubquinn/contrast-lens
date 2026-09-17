export function hasExplicitNoBorder(styleText: string): boolean {
    return (
        /\bborder\s*:\s*none\b/.test(styleText) ||
        /\bborder-style\s*:\s*none\b/.test(styleText) ||
        /\bborder-width\s*:\s*0(?![\d.])/.test(styleText) ||
        /\bborder\s*:\s*0(?![\d.])/.test(styleText)
    );
}
