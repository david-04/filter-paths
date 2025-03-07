import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { filterStack } from "../helpers/filter-stack.js";
import { forEachRuleRecursive } from "../helpers/for-each-rule-recursive.js";
import { isImportFile } from "../helpers/rule-type-utils.js";
import { stringifyStack } from "../helpers/stringify-stack.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that no rule is nested under an "import" rule
//----------------------------------------------------------------------------------------------------------------------

export function assertNoRuleUnderImport(rules: ReadonlyArray<Rule>) {
    forEachRuleRecursive(rules, rule => {
        if (!isImportFile(rule)) {
            const stack = filterStack.byFile(rule.stack, rule.source.file, { includeArgv: false });
            const [_, parent] = stack.slice().reverse();
            if (parent && isImportFile(parent)) {
                const message = [
                    `Rules must not be nested under an ${parent.stringified.operator} rule:`,
                    "",
                    stringifyStack.asOriginalWithLineNumbers(stack),
                ];
                fail(rule.source, message.join("\n"));
            }
        }
    });
}
