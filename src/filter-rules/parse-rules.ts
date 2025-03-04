import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { parseRule } from "./parse-rule.js";
import { ParentRule, Rule, RuleSource } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse all rules loaded from one file
//----------------------------------------------------------------------------------------------------------------------

export function parseRules(
    commandLineParameters: CommandLineParameters,
    globalParent: ParentRule,
    rules: ReadonlyArray<RuleSource>
): ReadonlyArray<Rule> {
    const result = new Array<Rule>();
    for (const rule of rules) {
        const localParent = findLocalParent(result, rule.indentation);
        if (localParent) {
            parseRule(commandLineParameters, localParent, rule);
        } else {
            result.push(parseRule(commandLineParameters, globalParent, rule));
        }
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Determine under which parent rule the given indentation sits
//----------------------------------------------------------------------------------------------------------------------

function findLocalParent(rules: ReadonlyArray<Rule>, indentation: number) {
    const expandedRules = expandLastNestedChild(rules);
    for (let index = expandedRules.length - 1; 0 <= index; index--) {
        const rule = expandedRules[index];
        if (!rule) {
            return undefined;
        }
        const ruleIndentation = rule.source?.indentation ?? 0;
        if (indentation === ruleIndentation) {
            return rule.parent;
        } else if (ruleIndentation < indentation) {
            return rule;
        }
    }
    return undefined;
}

//----------------------------------------------------------------------------------------------------------------------
// For the last element in the rules array, recursively expand
//----------------------------------------------------------------------------------------------------------------------

function expandLastNestedChild(rules: ReadonlyArray<Rule>) {
    const expandedRules = [...rules];
    for (let rule = rules[rules.length - 1]; rule; rule = rule.children[rule.children.length - 1]) {
        expandedRules.push(rule);
    }
    return expandedRules;
}
