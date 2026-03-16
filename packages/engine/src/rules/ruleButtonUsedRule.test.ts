import { describe, expect, it } from "vitest";
import { runRules } from "../core";
import { roleButtonUsedRule } from "./roleButtonUsedRule";

describe("roleButtonUsedRule", () => {
  it("returns a warning for a non-native element with role=button", () => {
    document.body.innerHTML = `
      <div role="button">Save</div>
    `;

    const findings = runRules(document, [roleButtonUsedRule]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "role-button-used",
      severity: "warning",
    });
    expect(findings[0]?.message).toContain('role="button"');
  });

  it("does not return a warning for a native button", () => {
    document.body.innerHTML = `
      <button>Save</button>
    `;

    const findings = runRules(document, [roleButtonUsedRule]);

    expect(findings).toHaveLength(0);
  });

  it("does not return a warning for input type=button", () => {
    document.body.innerHTML = `
      <input type="button" value="Save" />
    `;

    const findings = runRules(document, [roleButtonUsedRule]);

    expect(findings).toHaveLength(0);
  });

  it("does not return a warning for input type=submit", () => {
    document.body.innerHTML = `
      <input type="submit" value="Save" />
    `;

    const findings = runRules(document, [roleButtonUsedRule]);

    expect(findings).toHaveLength(0);
  });

  it("does not return a warning for input type=reset", () => {
    document.body.innerHTML = `
      <input type="reset" value="Reset" />
    `;

    const findings = runRules(document, [roleButtonUsedRule]);

    expect(findings).toHaveLength(0);
  });

  it("returns warnings for multiple custom role=button elements", () => {
    document.body.innerHTML = `
      <div role="button">Save</div>
      <span role="button">Cancel</span>
      <button>Native</button>
    `;

    const findings = runRules(document, [roleButtonUsedRule]);

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.ruleId === "role-button-used")).toBe(true);
  });
});
