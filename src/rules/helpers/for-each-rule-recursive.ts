import { Rule, Rules } from "../../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Recursively iterate over all rules
//----------------------------------------------------------------------------------------------------------------------

export function forEachRuleRecursive(rules: Rules, callback: (rule: Rule) => void) {
    rules.forEach(rule => {
        callback(rule);
        forEachRuleRecursive(rule.children, callback);
    });
}
