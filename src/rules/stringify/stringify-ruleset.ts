import { Rule, Rules, Ruleset, RulesToRender } from "../../types/rules.js";
import { Ansi } from "../../utils/ansi-escape-codes.js";
import { forEachRuleRecursive } from "../helpers/for-each-rule-recursive.js";
import {
    isDirectoryScope,
    isExclude,
    isExcludeGlob,
    isGoto,
    isImportFile,
    isInclude,
    isIncludeGlob,
} from "../helpers/rule-type-utils.js";
import { getIndent } from "./get-indent.js";

//------------------------------------------------------------------------------------------------------------------
// Stringify the audit trail of evaluated rules
//------------------------------------------------------------------------------------------------------------------

export function stringifyRuleset(ruleset: Ruleset, ansi: Ansi) {
    const rulesToRender = new Set<Rule>();
    forEachRuleRecursive(ruleset.rules, rule => {
        if (1 < ruleset.rules.length || rule !== ruleset.rules[0]) {
            rulesToRender.add(rule);
        }
    });
    return stringifyRules(ruleset.rules, rulesToRender, ansi);
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify the selected rules
//----------------------------------------------------------------------------------------------------------------------

function stringifyRules(rules: Rules, rulesToRender: RulesToRender, ansi: Ansi) {
    const lines = new Array<string>();
    forEachRuleRecursive(rules, rule => {
        if (rulesToRender.has(rule)) {
            const indent = getIndent(rule, rulesToRender);
            lines.push(stringifyRule(indent, rule, ansi));
        }
    });
    return lines as ReadonlyArray<string>;
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify a single rule
//----------------------------------------------------------------------------------------------------------------------

function stringifyRule(indent: string, rule: Rule, ansi: Ansi) {
    const colorize = getColorizer(rule, ansi);
    return colorize(`${indent}${rule.stringified.operator} ${rule.stringified.original}`);
}

function getColorizer(rule: Rule, ansi: Ansi): (text: string) => string {
    if (isIncludeGlob(rule) || (isDirectoryScope(rule) && isInclude(rule.secondaryAction))) {
        return text => ansi?.fgGreen(text) ?? text;
    } else if (isExcludeGlob(rule) || (isDirectoryScope(rule) && isExclude(rule.secondaryAction))) {
        return text => ansi?.fgRed(text) ?? text;
    } else if (isGoto(rule)) {
        return text => ansi?.normal(text) ?? text;
    } else if (isImportFile(rule)) {
        return text => ansi?.fgCyan(text) ?? text;
    } else {
        return text => ansi?.normal(text) ?? text;
    }
}
