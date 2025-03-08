import { OnGlobEvaluated, Result } from "../../types/result.js";
import { Rule } from "../../types/rules.js";
import { applyGlob } from "./apply-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Apply a "goto" rule
//----------------------------------------------------------------------------------------------------------------------

export function applyGotoRule(rule: Rule.Goto, path: string, onRuleApplied: OnGlobEvaluated): Result {
    const result = applyGlob(rule, Rule.INCLUDE_GLOB, rule.glob, path, onRuleApplied);
    return result && { ...result, ruleToSkip: rule.ruleToSkip, type: Result.GOTO };
}
