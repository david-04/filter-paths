import { Rule } from "../../types/rules.js";
import { isArgv, isGoto } from "./rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Filter a stack
//----------------------------------------------------------------------------------------------------------------------

export function filterStack(stack: Rule.Stack, ...filters: ReadonlyArray<(rule: Rule) => unknown>) {
    const reversed = stack.map(rule => ({ deleted: false, rule })).reverse();
    for (const item of reversed) {
        const hasDependentChildren = reversed
            .filter(other => !other.deleted)
            .map(other => other.rule)
            .filter(isGoto)
            .some(rule => rule.ruleToSkip === item.rule);
        item.deleted = filters.some(filter => filter(item.rule)) && !hasDependentChildren;
    }
    return reversed
        .filter(item => !item.deleted)
        .map(item => item.rule)
        .reverse();
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
