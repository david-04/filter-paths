import { Rule, RulesToRender } from "../../types/rules.js";
import { isGoto } from "../helpers/rule-type-utils.js";

const INDENT_WIDTH = 2;

//----------------------------------------------------------------------------------------------------------------------
// Get the indent string for a given rule
//----------------------------------------------------------------------------------------------------------------------

export function getIndent(rule: Rule, rulesToRender: RulesToRender) {
    const visibleParents = countVisibleParents(rule, rulesToRender);
    const gotoArrow = isGoto(rule) ? getGotoRuleArrow(rule, rulesToRender) : "";
    return "".padEnd(visibleParents * INDENT_WIDTH - gotoArrow.length) + gotoArrow;
}

//----------------------------------------------------------------------------------------------------------------------
// Count the number of visible parents
//----------------------------------------------------------------------------------------------------------------------

function countVisibleParents(rule: Rule, rulesToRender: RulesToRender) {
    return rule.stack
        .slice()
        .reverse()
        .slice(1)
        .filter(rule => rulesToRender.has(rule)).length;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the arrow (|<<<<<) to prepend in front of "goto" rules
//----------------------------------------------------------------------------------------------------------------------

function getGotoRuleArrow(rule: Rule.Goto, rulesToRender: RulesToRender) {
    return "|".padEnd(countStepsToGotoParent(rule, rulesToRender) * INDENT_WIDTH);
}

//----------------------------------------------------------------------------------------------------------------------
// Count the number of steps to get to the "goto rule"
//----------------------------------------------------------------------------------------------------------------------

function countStepsToGotoParent(rule: Rule.Goto, rulesToRender: RulesToRender) {
    let steps = 0;
    for (let parent: Rule | undefined = rule.parent; parent; parent = parent.parent) {
        if (parent === rule.ruleToSkip) {
            return steps + 1;
        }
        if (rulesToRender.has(parent)) {
            steps++;
        }
    }
    return steps;
}
