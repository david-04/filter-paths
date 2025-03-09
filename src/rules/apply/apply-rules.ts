import { EvaluatedRule, OnGlobEvaluated, Result } from "../../types/result.js";
import { Rule, Rules, Ruleset } from "../../types/rules.js";
import { isDirectoryScope, isFinal, isGoto, isImportFile, isInclude } from "../helpers/rule-type-utils.js";
import { applyDirectoryScopeRule } from "./apply-directory-scope-rule.js";
import { applyGotoRule } from "./apply-goto-rule.js";
import { applyImportFileRule } from "./apply-import-file-rule.js";
import { applyIncludeOrExcludeGlobRule } from "./apply-include-or-exclude-glob-rule.js";

//----------------------------------------------------------------------------------------------------------------------
// Apply the ruleset
//----------------------------------------------------------------------------------------------------------------------

export function applyRuleset(ruleset: Ruleset, path: string, onGlobEvaluated: OnGlobEvaluated) {
    const result = applyRules(ruleset.rules, path, onGlobEvaluated);
    if (isFinal(result)) {
        return { includePath: result.matchedPath, isDefaultFallback: false };
    } else {
        return { includePath: isInclude(ruleset.unmatchedPathAction), isDefaultFallback: true };
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Wrappers for applyRuleset
//----------------------------------------------------------------------------------------------------------------------

export namespace applyRuleset {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Apply the ruleset while auditing the evaluated rules
    //------------------------------------------------------------------------------------------------------------------

    export function withAuditTrail(ruleset: Ruleset, path: string) {
        const evaluatedRules = new Map<Rule, EvaluatedRule>();
        const result = applyRuleset(ruleset, path, rule => evaluatedRules.set(rule, { rule, matched: false }));
        return { evaluatedRules, ...result } as const;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Apply the ruleset without auditing
    //------------------------------------------------------------------------------------------------------------------

    export function withoutAuditTrail(ruleset: Ruleset, path: string) {
        return applyRuleset(ruleset, path, () => {});
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Apply all rules
//----------------------------------------------------------------------------------------------------------------------

export function applyRules(rules: Rules, path: string, onGlobEvaluated: OnGlobEvaluated) {
    for (const rule of rules) {
        const result = applyRule(rule, path, onGlobEvaluated);
        if (isFinal(result) || (isGoto(result) && rule === result.ruleToSkip)) {
            return result;
        }
    }
    return undefined;
}

//----------------------------------------------------------------------------------------------------------------------
// Apply a single rule
//----------------------------------------------------------------------------------------------------------------------

function applyRule(rule: Rule, path: string, onRuleApplied: OnGlobEvaluated): Result {
    if (isDirectoryScope(rule)) {
        return applyDirectoryScopeRule(rule, path, onRuleApplied);
    } else if (isGoto(rule)) {
        return applyGotoRule(rule, path, onRuleApplied);
    } else if (isImportFile(rule)) {
        return applyImportFileRule(rule, path, onRuleApplied);
    } else {
        rule satisfies Rule.IncludeOrExcludeGlob;
        return applyIncludeOrExcludeGlobRule(rule, path, onRuleApplied);
    }
}
