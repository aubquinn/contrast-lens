import { describe, expect, it } from "vitest";
import { buttonNoBorderRule } from "@contrast-lens/engine";
import { contrastLens } from "./index";
import { toHaveNoViolations } from "./matcher";
import { matcherContext } from "./matcherContext.fixture";

describe("contrastLens", () => {
    it("runs the default rules against a DOM root", () => {
        document.body.innerHTML = `<button style="border: none">Save</button>`;

        const findings = contrastLens(document);

        expect(findings).toHaveLength(1);
        expect(findings[0]).toMatchObject({
            ruleId: "button-no-border",
            severity: "error",
        });
    });

    it("can filter warnings from the result", () => {
        document.body.innerHTML = `<button style="border: 1px solid black">Save</button>`;

        expect(contrastLens(document, { includeWarnings: false })).toHaveLength(0);
    });

    it("accepts a custom rule set", () => {
        document.body.innerHTML = `<button style="border: none">Save</button>`;

        expect(contrastLens(document, { rules: [buttonNoBorderRule] })).toHaveLength(1);
    });
});

describe("toHaveNoViolations", () => {
    it("passes for an empty result", () => {
        expect(toHaveNoViolations.call(matcherContext, [])).toMatchObject({ pass: true });
    });

    it("returns formatted details for findings", () => {
        document.body.innerHTML = `<button style="border: none">Save</button>`;
        const [finding] = contrastLens(document);

        const result = toHaveNoViolations.call(matcherContext, [finding]);

        expect(result.pass).toBe(false);
        expect(result.message()).toContain("button-no-border [error]");
        expect(result.message()).toContain("<button style=\"border: none\">Save</button>");
    });
});
