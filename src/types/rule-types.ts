//----------------------------------------------------------------------------------------------------------------------
// Types of rules
//----------------------------------------------------------------------------------------------------------------------

export enum RuleType {
    AT_DIRECTORY = "at-directory",
    BREAK = "break",
    EXCLUDE_PATH = "exclude-path",
    IMPORT_FILE = "import-file",
    INCLUDE_PATH = "include-path",
    RULESET = "ruleset",
}

//----------------------------------------------------------------------------------------------------------------------
// Base properties for all rules
//----------------------------------------------------------------------------------------------------------------------

export type RuleSource = {
    readonly file: string;
    readonly indentation: number;
    readonly line: string;
    readonly lineNumber: number;
    readonly parent: RuleSource | undefined;
};

export type RuleBase = {
    readonly atDirectory: string | undefined;
    readonly children: Array<Rule>;
    readonly parent: Rule | undefined;
    readonly source: RuleSource | undefined;
};

export type GlobRule = RuleBase & {
    readonly glob: {
        readonly raw: string;
        readonly withAtDirectory: string;
    };
    readonly matcher: (path: string) => boolean;
};

//----------------------------------------------------------------------------------------------------------------------
// Type-specific rules
//----------------------------------------------------------------------------------------------------------------------

export type AtDirectoryRule = GlobRule & {
    readonly secondaryAction: RuleType.INCLUDE_PATH | RuleType.EXCLUDE_PATH | undefined;
    readonly type: RuleType.AT_DIRECTORY;
};
export type BreakRule = GlobRule & { readonly type: RuleType.BREAK; readonly parentToExit: Rule };
export type ExcludePathRule = GlobRule & { readonly type: RuleType.EXCLUDE_PATH };
export type ImportFileRule = RuleBase & { readonly file: string; type: RuleType.IMPORT_FILE };
export type IncludePathRule = GlobRule & { readonly type: RuleType.INCLUDE_PATH };

export type Rule = AtDirectoryRule | BreakRule | ExcludePathRule | ImportFileRule | IncludePathRule;

//----------------------------------------------------------------------------------------------------------------------
// The whole rule set
//----------------------------------------------------------------------------------------------------------------------

export type Ruleset = {
    readonly type: RuleType.RULESET;
    readonly rules: Array<Rule>;
    readonly finalDefaultAction: RuleType.INCLUDE_PATH | RuleType.EXCLUDE_PATH;
};

export type ParentRule = Rule | undefined;
