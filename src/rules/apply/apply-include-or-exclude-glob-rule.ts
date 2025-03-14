import { OnGlobEvaluated } from "../../types/result.js";
import { Rule } from "../../types/rules.js";
import { applyGlob } from "./apply-glob.js";
import { applyRules } from "./apply-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Apply an "include glob" or "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function applyIncludeOrExcludeGlobRule(
    rule: Rule.IncludeOrExcludeGlob,
    path: string,
    onRuleApplied: OnGlobEvaluated
) {
    const selfResult = applyGlob(rule, rule.type, rule.glob, path, onRuleApplied);
    if (selfResult) {
        return applyRules(rule.children, path, onRuleApplied) ?? selfResult;
    } else {
        return selfResult;
    }
}
