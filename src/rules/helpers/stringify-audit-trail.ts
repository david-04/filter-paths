import { EvaluatedRules } from "../../types/result.js";
import { Ruleset } from "../../types/rules.js";
import { applyRuleset } from "../apply/apply-rules.js";

//------------------------------------------------------------------------------------------------------------------
// Stringify the audit trail of evaluated rules
//------------------------------------------------------------------------------------------------------------------

export function stringifyAuditTrail(
    _ruleset: Ruleset,
    _evaluatedRules: EvaluatedRules,
    result: ReturnType<typeof applyRuleset>,
    _useColor: boolean
) {
    const auditTrail = ["TODO: Stringify the audit trail"];
    const conclusion = [
        "=> Result:",
        result.includePath ? "🟩 The path was included" : "🟥 The path was excluded",
        result.isDefaultFallback ? "by default (because no rule matched)" : "",
    ];
    return [...auditTrail, "", conclusion.filter(text => text).join(" ")];
}
