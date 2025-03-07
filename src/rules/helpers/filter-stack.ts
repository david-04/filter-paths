import { Rule } from "../../types/rules.js";
import { isArgv, isGoto } from "./rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Filter a stack
//----------------------------------------------------------------------------------------------------------------------

export function filterStack(stack: Rule.Stack, ...filters: ReadonlyArray<(rule: Rule) => unknown>) {
    let filtered = stack.map(rule => ({ shouldDelete: false, rule }));
    for (const filter of filters) {
        filtered = filtered.map(rule => ({ ...rule, shouldDelete: rule.shouldDelete || !filter(rule.rule) }));
    }
    return restoreParentsWithDependentGotoRules(filtered)
        .filter(({ shouldDelete, rule }) => !shouldDelete || hasDependentGotoRules(rule, stack))
        .map(({ rule }) => rule);
}

//----------------------------------------------------------------------------------------------------------------------
// Restore all "rule-to-bypass" rules whose "goto" children have NOT been deleted
//----------------------------------------------------------------------------------------------------------------------

export function restoreParentsWithDependentGotoRules(stack: ReadonlyArray<{ shouldDelete: boolean; rule: Rule }>) {
    const reversed = stack.slice().reverse();
    const rules = reversed.map(item => item.rule);
    for (const item of reversed) {
        item.shouldDelete = item.shouldDelete && !hasDependentGotoRules(item.rule, rules);
    }
    return reversed.slice().reverse();
}

//----------------------------------------------------------------------------------------------------------------------
// Check if the given rule has dependent "goto" rules in the stack
//----------------------------------------------------------------------------------------------------------------------

function hasDependentGotoRules(rule: Rule, stack: Rule.Stack) {
    // TODO: Ignore children that are marked for deletion
    return stack
        .filter(isGoto)
        .map(rule => rule.ruleToSkip)
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
        file: Rule.Fragment.File,
        options = { includeArgv: true as boolean } as const
    ) {
        return filterStack(stack, (rule: Rule) => {
            if (isArgv(rule.source)) {
                return options?.includeArgv ?? true;
            } else {
                return rule.source.file.equals(file);
            }
        });
    }
}
