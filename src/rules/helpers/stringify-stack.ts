import { Rule } from "../../types/rules.js";
import { isGoto } from "./rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Stringify a rule stack
//----------------------------------------------------------------------------------------------------------------------

export function stringifyStack(stack: Rule.Stack, stringify: (rule: Rule) => string | ReadonlyArray<string>) {
    return stack.flatMap((rule, index) => stringifyRule(stack, rule, index, stringify)).join("\n");
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify a rule within a stack
//----------------------------------------------------------------------------------------------------------------------

function stringifyRule(
    stack: Rule.Stack,
    rule: Rule,
    index: number,
    stringify: (rule: Rule) => string | ReadonlyArray<string>
) {
    const indent = getIndent(stack, index, rule);
    const lineOrLines = stringify(rule);
    const lines: ReadonlyArray<string> = Array.isArray(lineOrLines) ? lineOrLines : [lineOrLines];
    return lines.map(line => `${indent}${line}`);
}

//----------------------------------------------------------------------------------------------------------------------
// Calculate the indent
//----------------------------------------------------------------------------------------------------------------------

function getIndent(stack: Rule.Stack, index: number, rule: Rule) {
    const indentWidth = 2;
    const gotoArrow = isGoto(rule) ? getGotoRuleArrow(stack, indentWidth, index, rule) : "";
    return "".padEnd(index * indentWidth - gotoArrow.length) + gotoArrow;
}

function getGotoRuleArrow(stack: Rule.Stack, indentWidth: number, index: number, rule: Rule.Goto) {
    const parentToSkip = stack.findIndex(current => current === rule.ruleToSkip);
    if (0 <= parentToSkip) {
        const indicatorWidth = indentWidth * (index - parentToSkip);
        return ["|", "".padEnd(indicatorWidth - 1, "<")].join("");
    }
    return "";
}

//----------------------------------------------------------------------------------------------------------------------
// Predefined stringifiers
//----------------------------------------------------------------------------------------------------------------------

export namespace stringifyStack {
    //------------------------------------------------------------------------------------------------------------------
    // Show the globs as they are defined in the source file
    //------------------------------------------------------------------------------------------------------------------

    export function asOriginal(stack: Rule.Stack) {
        return stringifyStack(stack, ({ stringified }) => concat(stringified.operator, stringified.original));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Show the effective globs after expansion
    //------------------------------------------------------------------------------------------------------------------

    export function asEffective(stack: Rule.Stack) {
        return stringifyStack(stack, ({ stringified }) => concat(stringified.operator, stringified.effective));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Concatenate non-empty values
    //------------------------------------------------------------------------------------------------------------------

    function concat(...values: ReadonlyArray<string>) {
        return values.filter(value => value).join(" ");
    }
}
