export type Config = {
    readonly filterRuleFiles: ReadonlyArray<string>;
    readonly caseSensitive: boolean;
    readonly normalizePaths: boolean;
};
