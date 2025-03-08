import { Rules } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { filterStack } from "../helpers/filter-stack.js";
import { forEachRuleRecursive } from "../helpers/for-each-rule-recursive.js";
import { isImportFile } from "../helpers/rule-type-utils.js";
import { stringifyStack } from "../helpers/stringify-stack.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that no rule is nested under an "import" rule
//----------------------------------------------------------------------------------------------------------------------

export function assertNoRuleUnderImport(rules: Rules) {
    forEachRuleRecursive(rules, rule => {
        if (!isImportFile(rule)) {
            const stack = filterStack.byFile(rule.stack, rule.source.file, { includeArgv: false });
            const [_, parent] = stack.slice().reverse();
            if (parent && isImportFile(parent)) {
                const stack = filterStack.byFile(rule.stack, rule.source.file, { includeArgv: false });
                const message = [
                    `Invalid nesting in ${rule.source.file.resolved} at line ${rule.source.lineNumber}:`,
                    "",
                    stringifyStack.asOriginalWithLineNumbers(stack),
                    "",
                    `An "${rule.parent.stringified.operator}" rule can't have nested children.`,
                ];
                fail(message.join("\n"));
            }
        }
    });
}
