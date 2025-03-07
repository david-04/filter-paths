//----------------------------------------------------------------------------------------------------------------------
// Filter rules
//----------------------------------------------------------------------------------------------------------------------

export namespace Rule {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Fragments
    //------------------------------------------------------------------------------------------------------------------

    export namespace Fragment {
        export type DirectoryScope = {
            readonly effective: string;
            readonly original: string;
        };

        export type File = {
            readonly absolute: string;
            readonly equals: (file: File | Rule.Source.File) => boolean;
            readonly original: string;
            readonly resolved: string;
        };

        export type Glob = {
            readonly effective: string;
            readonly matches: (path: string) => boolean;
            readonly original: string;
        };

        export type Stringified = {
            readonly effective: string;
            readonly original: string;
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    // Reference to where a rule was loaded from
    //------------------------------------------------------------------------------------------------------------------

    export namespace Source {
        export type File = {
            readonly file: Fragment.File;
            readonly indentation: number;
            readonly line: string;
            readonly lineNumber: number;
            readonly parent: Source | undefined;
            readonly type: "file";
        };

        export type Argv = {
            readonly argv: Fragment.File;
            readonly type: "argv";
        };
    }

    export type Source = Source.File | Source.Argv;

    //------------------------------------------------------------------------------------------------------------------
    // Types
    //------------------------------------------------------------------------------------------------------------------

    export enum Type {
        DIRECTORY_SCOPE = "directory-scope",
        BREAK = "break",
        EXCLUDE_GLOB = "exclude-glob",
        IMPORT_FILE = "import-file",
        INCLUDE_GLOB = "include-glob",
    }

    export const { DIRECTORY_SCOPE, BREAK, EXCLUDE_GLOB, IMPORT_FILE, INCLUDE_GLOB } = Type;

    export type IncludeOrExclude = Type.INCLUDE_GLOB | Type.EXCLUDE_GLOB;

    export type Stack = ReadonlyArray<Rule>;

    //------------------------------------------------------------------------------------------------------------------
    // Type-specific rules
    //------------------------------------------------------------------------------------------------------------------

    export type IncludeOrExcludeGlob = {
        readonly children: Array<Rule>;
        readonly directoryScope: Fragment.DirectoryScope | undefined;
        readonly glob: Fragment.Glob;
        readonly parent: Rule;
        readonly source: Rule.Source.File;
        readonly stack: Stack;
        readonly stringified: Fragment.Stringified;
        readonly type: Type.INCLUDE_GLOB | Type.EXCLUDE_GLOB;
    };

    export type IncludeGlob = IncludeOrExcludeGlob & { readonly type: Type.INCLUDE_GLOB };
    export type ExcludeGlob = IncludeOrExcludeGlob & { readonly type: Type.EXCLUDE_GLOB };

    export type DirectoryScope = {
        readonly children: Array<Rule>;
        readonly directoryScope: Fragment.DirectoryScope;
        readonly glob: Fragment.Glob;
        readonly parent: Rule;
        readonly secondaryAction: undefined | IncludeOrExclude;
        readonly source: Rule.Source.File;
        readonly stack: Stack;
        readonly stringified: Fragment.Stringified;
        readonly type: Type.DIRECTORY_SCOPE;
    };

    export type Break = {
        readonly children: Array<Rule>;
        readonly directoryScope: Fragment.DirectoryScope | undefined;
        readonly glob: Fragment.Glob;
        readonly parent: Rule;
        readonly parentToBreak: Rule;
        readonly source: Rule.Source.File;
        readonly stack: Stack;
        readonly stringified: Fragment.Stringified;
        readonly type: Type.BREAK;
    };

    export type ImportFile = {
        readonly children: Array<Rule>;
        readonly directoryScope: Fragment.DirectoryScope | undefined;
        readonly file: Fragment.File;
        readonly parent: Rule | undefined;
        readonly source: Rule.Source;
        readonly stack: Stack;
        readonly stringified: Fragment.Stringified;
        readonly type: Type.IMPORT_FILE;
    };
}

export type Rule = Rule.DirectoryScope | Rule.Break | Rule.IncludeOrExcludeGlob | Rule.ImportFile;

//------------------------------------------------------------------------------------------------------------------
// The whole rule set
//------------------------------------------------------------------------------------------------------------------

export type Ruleset = {
    readonly rules: Array<Rule>;
};
