import { Rule, Rules, Ruleset } from "../../types/rules.js";
import { stringifyGotoRuleArrow } from "../helpers/goto-rule-operator.js";
import { isGoto } from "../helpers/rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Print the rule set
//----------------------------------------------------------------------------------------------------------------------

export function printRuleset(ruleset: Ruleset) {
    const [first, second] = ruleset.rules;
    const skipOuterImportRules = !second;
    const rules = flattenRules(first && skipOuterImportRules ? first.children : ruleset.rules);
    for (const rule of rules) {
        const indent = getIndent(rule, skipOuterImportRules);
        const { original, operator } = rule.stringified;
        const command = [operator, original].filter(item => item).join(" ");
        console.log(`${indent}${command}`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Copy all nested rules into one flat array
//----------------------------------------------------------------------------------------------------------------------

function flattenRules(rules: Rules): Rules {
    return rules.reduce((array, rule) => [...array, rule, ...flattenRules(rule.children)], new Array<Rule>());
}

//----------------------------------------------------------------------------------------------------------------------
// Get the indentation string
//----------------------------------------------------------------------------------------------------------------------

function getIndent(rule: Rule, skipOutermostRule: boolean) {
    const INDENT = 2;
    const gotoArrow = isGoto(rule) ? getGotoArrow(rule, INDENT) : "";
    const width = countParents(rule, skipOutermostRule) * INDENT;
    const indent = new Array(width - gotoArrow.length).fill(" ").join("");
    return `${indent}${gotoArrow}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Count the number of parents
//----------------------------------------------------------------------------------------------------------------------

function countParents(rule: Rule, skipOutermostRule: boolean) {
    return countStepsToParent(rule, undefined) - (skipOutermostRule ? 1 : 0);
}

//----------------------------------------------------------------------------------------------------------------------
// Assemble the "arrow" to prepend to a "goto" rule
//----------------------------------------------------------------------------------------------------------------------

function getGotoArrow(rule: Rule.Goto, indent: number) {
    const steps = countStepsToParent(rule, rule.ruleToSkip);
    return stringifyGotoRuleArrow(steps * indent - 1);
}

//----------------------------------------------------------------------------------------------------------------------
// Count the number of steps from a rule to a specific parent or the top-most parent
//----------------------------------------------------------------------------------------------------------------------

function countStepsToParent(source: Rule, target: Rule | undefined) {
    let steps = 0;
    for (let parent: Rule | undefined = source; parent && parent !== target; parent = parent.parent) {
        steps++;
    }
    return steps - (target ? 0 : 1);
}
