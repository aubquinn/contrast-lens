export * from "./types.js";
export * from "./ruleRunner.js";

import { runRules } from "./ruleRunner.js";
import { allRules } from "../rules/index.js";

export function runAllRules(root: ParentNode): ReturnType<typeof runRules> {
  return runRules(root, allRules);
}

