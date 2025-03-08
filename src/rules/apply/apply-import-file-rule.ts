import { OnGlobEvaluated, Result } from "../../types/result.js";
import { Rule } from "../../types/rules.js";
import { applyRules } from "./apply-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Apply an "import file" rule
//----------------------------------------------------------------------------------------------------------------------

export function applyImportFileRule(rule: Rule.ImportFile, path: string, onRuleApplied: OnGlobEvaluated): Result {
    return applyRules(rule.children, path, onRuleApplied);
}
