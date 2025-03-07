import { Rule } from "../../types/rules.js";
import { isArgv, isBreak } from "./rule-type-guards.js";

//----------------------------------------------------------------------------------------------------------------------
// Filter a stack
//----------------------------------------------------------------------------------------------------------------------

export function filterStack(stack: Rule.Stack, ...filters: ReadonlyArray<(rule: Rule) => unknown>) {
    let filtered = stack.map(rule => ({ shouldDelete: false, rule }));
    for (const filter of filters) {
        filtered = filtered.filter(rule => ({ delete: rule.shouldDelete || !filter(rule.rule), rule }));
    }
    return filtered.filter(({ shouldDelete, rule }) => !shouldDelete || isParent(rule, stack)).map(({ rule }) => rule);
}

//----------------------------------------------------------------------------------------------------------------------
// Verify if the given rule is the "parent to break"-reference of a "break" rule within the stack
//----------------------------------------------------------------------------------------------------------------------

function isParent(rule: Rule, stack: Rule.Stack) {
    return stack
        .filter(isBreak)
        .map(rule => rule.parentToBreak)
        .includes(rule);
}

//----------------------------------------------------------------------------------------------------------------------
// Predefined filters
//----------------------------------------------------------------------------------------------------------------------

export namespace filterStack {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Filter a stack by file
    //------------------------------------------------------------------------------------------------------------------

    export function byFile(
        stack: Rule.Stack,
        source: Rule.Source.File,
        options = { includeArgv: true as boolean } as const
    ) {
        return filterStack(stack, (rule: Rule) => {
            if (isArgv(rule.source)) {
                return options?.includeArgv ?? true;
            } else {
                return rule.source.file.equals(source.file);
            }
        });
    }
}
