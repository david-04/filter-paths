import { Rule } from "../../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that no rule is under an "import" rule
//----------------------------------------------------------------------------------------------------------------------

export function assertNoRuleUnderImport(rules: ReadonlyArray<Rule>) {
    for (const rule of rules.flatMap(flattenRule)) {
        if (rule.type !== Rule.IMPORT_FILE) {
            const parentFile = rule.parent.source.type === "file" ? rule.parent.source.file : rule.parent.source.argv;
            if (parentFile.equals(rule.source.file)) {
                // TODO: Restore this functionality after revising the path handling
                //const stack = filterStack.byFile(rule.stack, rule.source.file, { includeArgv: true });
                //const stringified = stringifyStack.asOriginal(stack);
                //fail(rule.source, `Invalid nesting of child nodes under an input/import rule:\n${stringified}`);
            }
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------

function flattenRule(rule: Rule): ReadonlyArray<Rule> {
    return rule.children.reduce((array, child) => [...array, ...flattenRule(child)], [rule]);
}
