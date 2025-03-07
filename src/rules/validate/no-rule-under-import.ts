import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { filterStack } from "../helpers/filter-stack.js";
import { forEachRuleRecursive } from "../helpers/for-each-rule-recursive.js";
import { isArgv, isImportFile } from "../helpers/rule-type-utils.js";

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
                    formatStack(stack),
                ];
                fail(rule.source, message.join("\n"));
            }
        }
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Format the rule stack
//----------------------------------------------------------------------------------------------------------------------

function formatStack(stack: Rule.Stack) {
    const rules = stack.map(rule => rule.source).filter((rule): rule is Rule.Source.File => !isArgv(rule));
    const maxLineNumber = rules[stack.length - 1]?.lineNumber ?? 0;
    const maxLineNumberLength = `${maxLineNumber}`.length;
    return rules
        .map(rule => {
            const lineNumber = `${rule.lineNumber}`.padStart(maxLineNumberLength);
            return `${lineNumber}: ${rule.line}`;
        })
        .join("\n");
}
