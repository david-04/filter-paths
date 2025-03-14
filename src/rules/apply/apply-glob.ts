import { OnGlobEvaluated, Result } from "../../types/result.js";
import { Rule } from "../../types/rules.js";
import { isInclude } from "../helpers/rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Apply a glob (if applicable)
//----------------------------------------------------------------------------------------------------------------------

export function applyGlob(
    rule: Rule,
    includeOrExclude: Rule.Type.IncludeOrExclude,
    glob: Rule.Fragment.Glob,
    path: string,
    onRuleApplied: OnGlobEvaluated
): Result {
    const matched = glob.matches(path);
    onRuleApplied(rule, { matched });
    return matched ? { includePath: matched === !!isInclude(includeOrExclude), type: Result.FINAL } : undefined;
}
