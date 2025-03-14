import { AuditTrail, EvaluatedRules, MatchStatus } from "../../types/result.js";
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

export function stringifyAuditTrail(ruleset: Ruleset, auditTrail: AuditTrail, ansi: Ansi) {
    const rulesToRender = selectRulesToRender(auditTrail.evaluatedRules);
    const stack = stringifyRules(ruleset.rules, rulesToRender, auditTrail.evaluatedRules, ansi);
    const conclusion = `Result: ${stringifyConclusion(auditTrail, ansi)}`;
    return [...stack, "", conclusion];
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify the conclusion to indicate if the path would be included or excluded
//----------------------------------------------------------------------------------------------------------------------

function stringifyConclusion(auditTrail: AuditTrail, ansi: Ansi) {
    const includedOrExcluded = auditTrail.includePath
        ? (ansi?.fgGreen("included") ?? "included")
        : (ansi?.fgRed("excluded") ?? "excluded");
    const fallthroughAdvice = auditTrail.isDefaultFallback ? " by default (because no rule matched)" : "";
    return `The path is ${includedOrExcluded}${fallthroughAdvice}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Determine the rules to be rendered
//----------------------------------------------------------------------------------------------------------------------

function selectRulesToRender(evaluatedRules: EvaluatedRules): RulesToRender {
    const rulesToRender = new Set<Rule>();
    for (const evaluatedRule of evaluatedRules.keys()) {
        for (let rule: Rule | undefined = evaluatedRule; rule; rule = rule.parent) {
            if (!isImportFile(rule)) {
                rulesToRender.add(rule);
            }
        }
    }
    return rulesToRender;
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify the selected rules
//----------------------------------------------------------------------------------------------------------------------

function stringifyRules(rules: Rules, rulesToRender: RulesToRender, evaluatedRules: EvaluatedRules, ansi: Ansi) {
    const lines = new Array<string>();
    forEachRuleRecursive(rules, rule => {
        if (rulesToRender.has(rule)) {
            const indent = getIndent(rule, rulesToRender);
            lines.push(stringifyRule(indent, rule, evaluatedRules.get(rule), ansi));
        }
    });
    return lines as ReadonlyArray<string>;
}

//----------------------------------------------------------------------------------------------------------------------
// Stringify a single rule
//----------------------------------------------------------------------------------------------------------------------

function stringifyRule(indent: string, rule: Rule, matchStatus: MatchStatus | undefined, ansi: Ansi) {
    const colorize = matchStatus?.matched ? getColorizer(rule, ansi) : (text: string) => ansi?.dim(text) ?? text;
    return colorize(`${indent}${rule.stringified.operator} ${rule.stringified.original}`);
}

function getColorizer(rule: Rule, ansi: Ansi): (text: string) => string {
    if (isIncludeGlob(rule) || (isDirectoryScope(rule) && isInclude(rule.secondaryAction))) {
        return text => ansi?.fgGreen(text) ?? text;
    } else if (isExcludeGlob(rule) || (isDirectoryScope(rule) && isExclude(rule.secondaryAction))) {
        return text => ansi?.fgRed(text) ?? text;
    } else if (isGoto(rule)) {
        return text => ansi?.fgBlue(text) ?? text;
    } else {
        return text => ansi?.normal(text) ?? text;
    }
}
