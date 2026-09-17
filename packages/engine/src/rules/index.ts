export * from './buttonNoBorderRule/buttonNoBorderRule.js';
export * from './linkNoForcedColoursOptOut/linkNoForcedColoursOptOut.js';

import { buttonNoBorderRule } from './buttonNoBorderRule/buttonNoBorderRule.js';
import { linkNoForcedColoursOptOutRule } from './linkNoForcedColoursOptOut/linkNoForcedColoursOptOut.js';

export const allRules = [buttonNoBorderRule, linkNoForcedColoursOptOutRule];
