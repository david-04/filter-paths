export type CommandLineParameters = {
    readonly filterRuleFiles: ReadonlyArray<string>;
    readonly caseSensitive: boolean;
    readonly normalizePaths: boolean;
};
