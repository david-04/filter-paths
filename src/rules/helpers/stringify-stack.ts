import { Rule } from "../../types/rules.js";
import { isBreak } from "./rule-type-guards.js";

const INDENT = 2;

//----------------------------------------------------------------------------------------------------------------------
// Stringify a rule stack
//----------------------------------------------------------------------------------------------------------------------

export function stringifyStack(
    stack: Rule.Stack,
    stringify: (rule: Rule, indent: string) => string | ReadonlyArray<string>
) {
    return stack.flatMap((rule, index) => stringify(rule, getIndent(stack, index, rule, INDENT))).join("\n");
}

//----------------------------------------------------------------------------------------------------------------------
// Calculate the indent
//----------------------------------------------------------------------------------------------------------------------

function getIndent(stack: Rule.Stack, index: number, rule: Rule, stepWidth: number) {
    if (isBreak(rule)) {
        const parentToBreakIndex = stack.findIndex(current => current === rule.parentToBreak);
        if (0 <= parentToBreakIndex) {
            const indicatorWidth = stepWidth * (index - parentToBreakIndex);
            return ["".padEnd(2 * stepWidth - indicatorWidth), "|", "".padEnd(indicatorWidth - 1, "<")].join("");
        }
    }
    return "".padEnd(index * stepWidth);
}

//----------------------------------------------------------------------------------------------------------------------
// Predefined stringifiers
//----------------------------------------------------------------------------------------------------------------------

export namespace stringifyStack {
    //------------------------------------------------------------------------------------------------------------------
    // Show the globs as they are defined in the source file
    //------------------------------------------------------------------------------------------------------------------

    export function asOriginal(stack: Rule.Stack) {
        return stringifyStack(stack, (rule, indent) => `${indent}${rule.stringified.original}`);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Show the effective globs after expansion
    //------------------------------------------------------------------------------------------------------------------

    export function asEffective(stack: Rule.Stack) {
        return stringifyStack(stack, (rule, indent) => `${indent}${rule.stringified.effective}`);
    }
}
