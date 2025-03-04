//----------------------------------------------------------------------------------------------------------------------
// Parameters passed via the command line
//----------------------------------------------------------------------------------------------------------------------

export type Parameters = {
    readonly caseSensitive: boolean;
    readonly files: ReadonlyArray<string>;
    readonly normalizePaths: boolean;
};
