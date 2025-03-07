import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { forEachRuleRecursive } from "../helpers/for-each-rule-recursive.js";
import { isGoto } from "../helpers/rule-type-utils.js";
import { stringifyStack } from "../helpers/stringify-stack.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that no rule is nested under a "goto" rule
//----------------------------------------------------------------------------------------------------------------------

export function assertNoRuleUnderGoto(rules: ReadonlyArray<Rule>) {
    forEachRuleRecursive(rules, rule => {
        if (rule.parent && isGoto(rule.parent)) {
            const message = [
                `Rules must not be nested under a "goto" rule:`,
                "",
                stringifyStack.asOriginal(rule.stack),
            ];
            fail(rule.source, message.join("\n"));
        }
    });
}
