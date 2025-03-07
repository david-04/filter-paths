import { Rule } from "../../types/rules.js";
import { isArgv, isBreak } from "./rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Filter a stack
//----------------------------------------------------------------------------------------------------------------------

export function filterStack(stack: Rule.Stack, ...filters: ReadonlyArray<(rule: Rule) => unknown>) {
    let filtered = stack.map(rule => ({ shouldDelete: false, rule }));
    for (const filter of filters) {
        filtered = filtered.map(rule => ({ ...rule, shouldDelete: rule.shouldDelete || !filter(rule.rule) }));
    }
    return restoreParentsToBreak(filtered)
        .filter(({ shouldDelete, rule }) => !shouldDelete || isParentToBreak(rule, stack))
        .map(({ rule }) => rule);
}

//----------------------------------------------------------------------------------------------------------------------
// Restore all "parents-to-break" whose children have not been deleted
//----------------------------------------------------------------------------------------------------------------------

export function restoreParentsToBreak(stack: ReadonlyArray<{ shouldDelete: boolean; rule: Rule }>) {
    const reversed = stack.slice().reverse();
    const rules = reversed.map(item => item.rule);
    for (const item of reversed) {
        item.shouldDelete = item.shouldDelete && !isParentToBreak(item.rule, rules);
    }
    return reversed.slice().reverse();
}

//----------------------------------------------------------------------------------------------------------------------
// Verify if the given rule is the "parent to break"-reference of a "break" rule within the stack
//----------------------------------------------------------------------------------------------------------------------

function isParentToBreak(rule: Rule, stack: Rule.Stack) {
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
