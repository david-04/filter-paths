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
        readonly matched: boolean;
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

export type OnGlobEvaluated = (rule: Rule, result: { readonly matched: boolean }) => void;
