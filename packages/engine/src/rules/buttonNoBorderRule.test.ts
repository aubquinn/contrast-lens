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

  it("returns an error for a button with dotted border", () => {
    document.body.innerHTML = `<button style="border: 2px dotted black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with dashed border", () => {
    document.body.innerHTML = `<button style="border: 2px dashed black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with double border", () => {
    document.body.innerHTML = `<button style="border: 4px double black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with groove border", () => {
    document.body.innerHTML = `<button style="border: 2px groove black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with ridge border", () => {
    document.body.innerHTML = `<button style="border: 2px ridge black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with inset border", () => {
    document.body.innerHTML = `<button style="border: 2px inset black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with outset border", () => {
    document.body.innerHTML = `<button style="border: 2px outset black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with hidden border", () => {
    document.body.innerHTML = `<button style="border: 2px hidden">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns an error for a button with solid border but width less than 1px", () => {
    document.body.innerHTML = `<button style="border: 0.5px solid black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "error",
    });
  });

  it("returns a warning for a button with solid border but width less than 2px", () => {
    document.body.innerHTML = `<button style="border: 1px solid black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "button-no-border",
      severity: "warning",
    });
  });

  it("does not return a warning for a button with solid border and width 2px or more", () => {
    document.body.innerHTML = `<button style="border: 2px solid black">Save</button>`;

    const findings = runRules(document, [buttonNoBorderRule]);

    expect(findings).toHaveLength(0);
  });
});
