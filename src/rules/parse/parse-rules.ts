import { Config } from "../../types/config.js";
import { Rule, Rules } from "../../types/rules.js";
import { isFile } from "../helpers/rule-type-utils.js";
import { parseRule } from "./parse-rule.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse all rules
//----------------------------------------------------------------------------------------------------------------------

export function parseRules(config: Config, importRule: Rule.ImportFile, rules: ReadonlyArray<Rule.Source.File>) {
    for (const rule of rules) {
        const parent = findParent(importRule, rule);
        parseRule(config, parent, rule);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Find the parent rule to attach the child to
//----------------------------------------------------------------------------------------------------------------------

function findParent(importRule: Rule.ImportFile, rule: Rule.Source.File): Rule {
    for (const parent of flattenToLastChild(importRule.children).reverse()) {
        if (!isSameFile(parent, rule)) {
            continue;
        }
        const parentIndentation = "indentation" in parent.source ? parent.source.indentation : 0;
        if (rule.indentation === parentIndentation && parent.parent) {
            return parent.parent;
        } else if (parentIndentation < rule.indentation) {
            return parent;
        }
    }
    return importRule;
}

function isSameFile(parent: Rule, rule: Rule.Source.File) {
    return rule.file.equals(isFile(parent.source) ? parent.source.file : parent.source.argv);
}

//----------------------------------------------------------------------------------------------------------------------
// Copy the array and, for the last top-level element, append the whole change chain to the last child
//----------------------------------------------------------------------------------------------------------------------

function flattenToLastChild(rules: Rules) {
    const flattened = [...rules];
    for (let lastChild = getLastChild(flattened); lastChild; lastChild = getLastChild(flattened)) {
        flattened.push(lastChild);
    }
    return flattened;
}

function getLastChild(rules: Rules) {
    const children = rules[rules.length - 1]?.children ?? [];
    return children[children.length - 1];
}
