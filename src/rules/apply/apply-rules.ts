import { EvaluatedRule, OnGlobEvaluated, Result } from "../../types/result.js";
import { Rule, Rules, Ruleset } from "../../types/rules.js";
import { normalizePath } from "../helpers/normalize-path.js";
import { isDirectoryScope, isFinal, isGoto, isImportFile, isInclude } from "../helpers/rule-type-utils.js";
import { stringifyAuditTrail } from "../helpers/stringify-audit-trail.js";
import { applyDirectoryScopeRule } from "./apply-directory-scope-rule.js";
import { applyGotoRule } from "./apply-goto-rule.js";
import { applyImportFileRule } from "./apply-import-file-rule.js";
import { applyIncludeOrExcludeGlobRule } from "./apply-include-or-exclude-glob-rule.js";

//----------------------------------------------------------------------------------------------------------------------
// Apply the ruleset
//----------------------------------------------------------------------------------------------------------------------

export function applyRuleset(ruleset: Ruleset, path: string, onGlobEvaluated: OnGlobEvaluated) {
    const result = applyRules(ruleset.rules, path, onGlobEvaluated);
    return isFinal(result)
        ? { includePath: result.matchedPath, isDefaultFallback: false }
        : { includePath: isInclude(ruleset.unmatchedPathAction), isDefaultFallback: true };
}

//----------------------------------------------------------------------------------------------------------------------
// Wrappers for applyRuleset
//----------------------------------------------------------------------------------------------------------------------

export namespace applyRuleset {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Apply the ruleset while auditing the evaluated rules
    //------------------------------------------------------------------------------------------------------------------

    export function withAuditTrail(
        ruleset: Ruleset,
        path: string,
        options: { readonly printOriginalPath: boolean; useColor: boolean }
    ) {
        const normalized = normalizePath(path);
        const evaluated = new Map<Rule, EvaluatedRule>();
        const result = applyRuleset(ruleset, normalized, (rule, result) => evaluated.set(rule, { rule, ...result }));
        return [
            ...(options.printOriginalPath ? [`Path to evaluate: ${path}`] : []),
            `Normalized path:  ${normalized}`,
            "",
            ...stringifyAuditTrail(ruleset, evaluated, result, options.useColor),
        ];
    }

    //------------------------------------------------------------------------------------------------------------------
    // Apply the ruleset without auditing
    //------------------------------------------------------------------------------------------------------------------

    export function withoutAuditTrail(ruleset: Ruleset, path: string) {
        return { ...applyRuleset(ruleset, normalizePath(path), () => {}), normalizePath } as const;
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
