import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { filterStack } from "../helpers/filter-stack.js";
import { forEachRuleRecursive } from "../helpers/for-each-rule-recursive.js";
import { isFile, isGoto } from "../helpers/rule-type-utils.js";
import { stringifyStack } from "../helpers/stringify-stack.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that no rule is nested under a "goto" rule
//----------------------------------------------------------------------------------------------------------------------

export function assertNoRuleUnderGoto(rules: ReadonlyArray<Rule>) {
    forEachRuleRecursive(rules, rule => {
        if (rule.parent && isGoto(rule.parent) && isFile(rule.source)) {
            const stack = filterStack.byFile(rule.stack, rule.source.file, { includeArgv: false });
            const message = [
                `Invalid nesting in ${rule.source.file.resolved} at line ${rule.source.lineNumber}:`,
                "",
                stringifyStack.asOriginalWithLineNumbers(stack),
                "",
                `A "goto" rule can't have nested children.`,
            ];
            fail(message.join("\n"));
        }
    });
}
