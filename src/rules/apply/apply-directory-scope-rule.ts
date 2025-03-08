import { OnGlobEvaluated, Result } from "../../types/result.js";
import { Rule } from "../../types/rules.js";
import { applyGlob } from "./apply-glob.js";
import { applyRules } from "./apply-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Apply a "directory scope" rule
//----------------------------------------------------------------------------------------------------------------------

export function applyDirectoryScopeRule(
    rule: Rule.DirectoryScope,
    path: string,
    onRuleApplied: OnGlobEvaluated
): Result {
    const selfResult = rule.secondaryAction && applyGlob(rule, rule.secondaryAction, rule.glob, path, onRuleApplied);
    const childResult = applyRules(rule.children, path, onRuleApplied);
    return childResult ?? selfResult;
}
