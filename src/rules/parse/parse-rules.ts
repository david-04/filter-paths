import { normalize, resolve } from "path";
import { CommandLineParameters } from "../../cli/command-line-parameters.js";
import { fail } from "../../utils/fail.js";
import { ParentRule, Rule, RuleSource, RuleType } from "../types/rule-types.js";
import { parseRule } from "./parse-rule.js";

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
        const localParent = findLocalParent(result, rule);
        assertNoNestingUnderImportRule(globalParent ?? localParent, rule);
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

function findLocalParent(parents: ReadonlyArray<Rule>, rule: RuleSource) {
    const expandedRules = expandLastNestedChild(parents);
    for (let index = expandedRules.length - 1; 0 <= index; index--) {
        const parent = expandedRules[index];
        if (!parent) {
            return undefined;
        }
        if (isApplicableParent(parent, rule)) {
            const ruleIndentation = parent.source?.indentation ?? 0;
            if (rule.indentation === ruleIndentation) {
                return parent.parent;
            } else if (ruleIndentation < rule.indentation) {
                return parent;
            }
        }
    }
    return undefined;
}

function isApplicableParent(parent: Rule, rule: RuleSource) {
    const parentSourceFile = parent.source?.file;
    return undefined !== parentSourceFile && parentSourceFile === rule.file;
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

//----------------------------------------------------------------------------------------------------------------------
// Verify that no rule is nested under an "import" rule
//----------------------------------------------------------------------------------------------------------------------

function assertNoNestingUnderImportRule(parent: ParentRule, rule: RuleSource) {
    const ruleFile = normalize(resolve(rule.file));
    for (let currentParent = parent; currentParent; currentParent = currentParent.parent) {
        if (currentParent.type === RuleType.IMPORT_FILE) {
            const currentParentSource = currentParent.source;
            if (currentParentSource && ruleFile === normalize(resolve(currentParentSource.file))) {
                fail(rule, 'Filter rules must not be nested as a child below an "import" rule.');
            }
        }
    }
}
