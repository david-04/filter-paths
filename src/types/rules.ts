import { RuleSource } from "./rule-source.js";

//----------------------------------------------------------------------------------------------------------------------
// Parsed rules
//----------------------------------------------------------------------------------------------------------------------

export namespace Rule {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Types
    //------------------------------------------------------------------------------------------------------------------

    export enum Type {
        AT_DIRECTORY = "at-directory",
        BREAK = "break",
        EXCLUDE_GLOB = "exclude-glob",
        IMPORT_FILE = "import-file",
        INCLUDE_GLOB = "include-glob",
        RULESET = "ruleset",
    }

    export const { AT_DIRECTORY, BREAK, EXCLUDE_GLOB, IMPORT_FILE, INCLUDE_GLOB, RULESET } = Type;

    //------------------------------------------------------------------------------------------------------------------
    // Base class
    //------------------------------------------------------------------------------------------------------------------

    export type Parent = Rule | Ruleset;

    export namespace Internal {
        export type Base = {
            readonly atDirectory:
                | undefined
                | {
                      readonly original: string;
                      readonly effective: string;
                  };
            readonly children: Array<Rule>;
            readonly parent: Parent;
            readonly source: RuleSource;
        };

        export type Glob = {
            readonly glob: {
                readonly original: string;
                readonly effective: string;
            };
            readonly matches: (path: string) => boolean;
        };

        export type BaseGlob = Base & Glob;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Type-specific rules
    //------------------------------------------------------------------------------------------------------------------

    export type ExcludeGlob = Internal.BaseGlob & { readonly type: Type.EXCLUDE_GLOB };
    export type IncludeGlob = Internal.BaseGlob & { readonly type: Type.INCLUDE_GLOB };

    export type GlobSelector = ExcludeGlob | IncludeGlob;

    export type AtDirectory = Internal.BaseGlob & {
        readonly secondaryAction: Type.INCLUDE_GLOB | Type.EXCLUDE_GLOB | undefined;
        readonly type: Type.AT_DIRECTORY;
    } & {
        readonly atDirectory: {
            readonly original: string;
            readonly effective: string;
        };
    };
    export type Break = Internal.BaseGlob & { readonly type: Type.BREAK; readonly parentToBreak: Rule };
    export type ImportFile = Internal.Base & { readonly file: string; type: Type.IMPORT_FILE };
}
export type Rule = Rule.AtDirectory | Rule.Break | Rule.GlobSelector | Rule.ImportFile;

//------------------------------------------------------------------------------------------------------------------
// The whole rule set
//------------------------------------------------------------------------------------------------------------------

export type Ruleset = {
    readonly rules: Array<Rule>;
    readonly type: Rule.Type.RULESET;
};
