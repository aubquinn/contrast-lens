import { contrastLens } from "@contrast-lens/jest";

describe("@contrast-lens/jest", () => {
    it("passes when the DOM has no findings", () => {
        document.body.innerHTML = `<button style="border: 2px solid transparent">Save</button>`;

        expect(contrastLens(document)).toHaveNoViolations();
    });

    it("fails with useful finding details", () => {
        document.body.innerHTML = `<button style="border: none">Save</button>`;

        const findings = contrastLens(document);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: "button-no-border",
            severity: "error",
        });
        expect(() => expect(findings).toHaveNoViolations()).toThrow(
            "button-no-border [error]",
        );
    });

    it("can exclude warnings from the scan", () => {
        document.body.innerHTML = `<button style="border: 1px solid black">Save</button>`;

        expect(contrastLens(document, { includeWarnings: false })).toHaveNoViolations();
    });
});