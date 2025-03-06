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
    }

    export const { AT_DIRECTORY, BREAK, EXCLUDE_GLOB, IMPORT_FILE, INCLUDE_GLOB } = Type;

    export type IncludeOrExclude = Type.INCLUDE_GLOB | Type.EXCLUDE_GLOB;

    //------------------------------------------------------------------------------------------------------------------
    // Utility types
    //------------------------------------------------------------------------------------------------------------------

    export namespace Fragment {
        export type DirectoryScope = {
            readonly original: string;
            readonly effective: string;
        };

        export type Glob = {
            readonly original: string;
            readonly effective: string;
            readonly matches: (path: string) => boolean;
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Type-specific rules
    //------------------------------------------------------------------------------------------------------------------

    export type IncludeOrExcludeGlob = {
        readonly atDirectory: Fragment.DirectoryScope | undefined;
        readonly children: Array<Rule>;
        readonly glob: Fragment.Glob;
        readonly parent: Rule;
        readonly source: RuleSource.File;
        readonly type: Type.INCLUDE_GLOB | Type.EXCLUDE_GLOB;
    };

    export type IncludeGlob = IncludeOrExcludeGlob & { readonly type: Type.INCLUDE_GLOB };
    export type ExcludeGlob = IncludeOrExcludeGlob & { readonly type: Type.EXCLUDE_GLOB };

    export type AtDirectory = {
        readonly atDirectory: Fragment.DirectoryScope;
        readonly children: Array<Rule>;
        readonly glob: Fragment.Glob;
        readonly parent: Rule;
        readonly secondaryAction: undefined | IncludeOrExclude;
        readonly source: RuleSource.File;
        readonly type: Type.AT_DIRECTORY;
    };

    export type Break = {
        readonly atDirectory: Fragment.DirectoryScope | undefined;
        readonly children: Array<Rule>;
        readonly glob: Fragment.Glob;
        readonly parent: Rule;
        readonly parentToBreak: Rule;
        readonly source: RuleSource.File;
        readonly type: Type.BREAK;
    };

    export type ImportFile = {
        readonly atDirectory: Fragment.DirectoryScope | undefined;
        readonly children: Array<Rule>;
        readonly file: string;
        readonly parent: Rule | undefined;
        readonly source: RuleSource;
        readonly type: Type.IMPORT_FILE;
    };
}

export type Rule = Rule.AtDirectory | Rule.Break | Rule.IncludeOrExcludeGlob | Rule.ImportFile;

//------------------------------------------------------------------------------------------------------------------
// The whole rule set
//------------------------------------------------------------------------------------------------------------------

export type Ruleset = {
    readonly rules: Array<Rule>;
};
