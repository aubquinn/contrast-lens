export * from "./types";
export * from "./ruleRunner";

import { runRules } from "./ruleRunner";
import { allRules } from "../rules";

export function runAllRules(root: ParentNode): ReturnType<typeof runRules> {
  return runRules(root, allRules);
}

