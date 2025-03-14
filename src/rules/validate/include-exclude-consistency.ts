import { Rule, Ruleset } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { forEachRuleRecursive } from "../helpers/for-each-rule-recursive.js";
import { invert, isDirectoryScope, isIncludeOrExcludeGlob } from "../helpers/rule-type-utils.js";
import { stringifyStack } from "../stringify/stringify-stack.js";

//----------------------------------------------------------------------------------------------------------------------
// Assert that "+" and "-" rules are nested correctly and consistently
//----------------------------------------------------------------------------------------------------------------------

export function assertIncludeExcludeConsistency(ruleset: Ruleset) {
    forEachRuleRecursive(ruleset.rules, rule => assertRuleIsValid(rule, ruleset.unmatchedPathAction));
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the given rule is valid
//----------------------------------------------------------------------------------------------------------------------

function assertRuleIsValid(rule: Rule, unmatchedPathAction: Rule.Type.IncludeOrExclude) {
    const childType = getType(rule);
    if (childType) {
        const parentType = getParentType(rule, unmatchedPathAction);
        if (parentType && childType !== invert(parentType)) {
            const message =
                parentType === Rule.Type.INCLUDE_GLOB
                    ? "Expected an exclude rule (-) but found an include rule (+)"
                    : "Expected an include rule (+) but found an exclude rule (-)";
            const stack = stringifyStack.asOriginal(rule.stack);
            fail(rule.source, [message, "", stack].join("\n"));
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Get the type of a rule
//----------------------------------------------------------------------------------------------------------------------

function getType(rule: Rule): Rule.Type.IncludeOrExclude | undefined {
    if (isIncludeOrExcludeGlob(rule)) {
        return rule.type;
    } else if (isDirectoryScope(rule)) {
        return rule.secondaryAction;
    } else {
        return undefined;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Get the type of the first including or excluding parent rule
//----------------------------------------------------------------------------------------------------------------------

function getParentType(rule: Rule, unmatchedPathAction: Rule.Type.IncludeOrExclude) {
    const parentType = rule.stack.map(getType).reverse().slice(1);
    return parentType.filter(type => type)[0] ?? unmatchedPathAction;
}
