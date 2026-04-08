import { describe, expect, it } from "vitest";
import { runRules } from "../core";
import { buttonNoBorderRule } from "./buttonNoBorderRule";

describe("buttonNoBorderRule", () => {
  it("returns an error for a button with no border", () => {
    document.body.innerHTML = `<button style="border: none">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with zero border width", () => {
    document.body.innerHTML = `<button style="border-width: 0; border-style: none">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe("error");
  });

  it("does not return a warning for a button with a visible border", () => {
    document.body.innerHTML = `<button style="border: 2px solid black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(0);
  });

  it("does not return a warning for input type=button with a visible border", () => {
    document.body.innerHTML = `<input type="button" style="border: 1px solid black" value="Save" />`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(0);
  });
});
