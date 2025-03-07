import { Rule } from "../../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Recursively copy all child rules into one top-level array
//----------------------------------------------------------------------------------------------------------------------

export function flattenRules(rules: ReadonlyArray<Rule>): ReadonlyArray<Rule> {
    return rules.flatMap(rule => [rule, ...flattenRules(rule.children)]);
}
