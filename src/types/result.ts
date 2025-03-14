import { applyRuleset } from "../rules/apply/apply-rules.js";
import { Rule } from "./rules.js";

//----------------------------------------------------------------------------------------------------------------------
// The result of applying a rule (and its children)
//----------------------------------------------------------------------------------------------------------------------

export namespace Result {
    export enum Type {
        FINAL = "final-result",
        GOTO = "goto-result",
    }

    export const { FINAL, GOTO } = Type;

    export type Final = {
        readonly includePath: boolean;
        readonly type: Type.FINAL;
    };

    export type Goto = {
        readonly ruleToSkip: Rule;
        readonly type: Type.GOTO;
    };
}

export type Result = Result.Final | Result.Goto | undefined;

//----------------------------------------------------------------------------------------------------------------------
// Tracing
//----------------------------------------------------------------------------------------------------------------------

export type MatchStatus = { readonly matched: boolean };
export type EvaluatedRules = ReadonlyMap<Rule, MatchStatus>;
export type OnGlobEvaluated = (rule: Rule, matched: MatchStatus) => void;
export type AuditTrail = ReturnType<typeof applyRuleset.withAuditTrail>;
