import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that "+" and "-" rules are nested correctly and consistently
//----------------------------------------------------------------------------------------------------------------------

export function assertIncludeExcludeConsistency(rules: ReadonlyArray<Rule>, topLevelRuleType: Rule.IncludeOrExclude) {
    rules.forEach(rule => assertValidNesting(topLevelRuleType, rule));
}
//----------------------------------------------------------------------------------------------------------------------
// Recursively verify the nesting
//----------------------------------------------------------------------------------------------------------------------

function assertValidNesting(expectedMode: Rule.IncludeOrExclude, rule: Rule) {
    if (rule.type === Rule.INCLUDE_GLOB || rule.type === Rule.EXCLUDE_GLOB) {
        if (expectedMode !== rule.type) {
            failWithInvalidNesting(rule, expectedMode);
        } else {
            rule.children.forEach(rule => assertValidNesting(invert(expectedMode), rule));
        }
    } else if (rule.type === Rule.DIRECTORY_SCOPE && rule.secondaryAction) {
        if (expectedMode !== rule.secondaryAction) {
            failWithInvalidNesting(rule, expectedMode);
        } else {
            rule.children.forEach(rule => assertValidNesting(invert(expectedMode), rule));
        }
    } else {
        rule.children.forEach(rule => assertValidNesting(expectedMode, rule));
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Invert the filter mode
//----------------------------------------------------------------------------------------------------------------------

function invert(filter: Rule.IncludeOrExclude) {
    return filter === Rule.EXCLUDE_GLOB ? Rule.INCLUDE_GLOB : Rule.EXCLUDE_GLOB;
}

//----------------------------------------------------------------------------------------------------------------------
// Fail when encountering invalid nesting
//----------------------------------------------------------------------------------------------------------------------

function failWithInvalidNesting(
    rule: Rule.DirectoryScope | Rule.IncludeGlob | Rule.ExcludeGlob,
    expectedMode: Rule.IncludeOrExclude
) {
    const expected =
        expectedMode === Rule.INCLUDE_GLOB
            ? "Expected include rule (+) but found an exclude rule (-) instead"
            : "Expected exclude rule (-) but found an include rule (+) instead";
    const stack = getStack(rule);
    fail(rule.source, stack ? `${expected}:\n\n${stack}` : expected);
}

function getStack(rule: Rule) {
    const { stack } = rule;
    if (2 < stack.length) {
        return stack.map((line, index) => `${"".padEnd(index * 2)}${line}`).join("\n");
    } else {
        return undefined;
    }
}
