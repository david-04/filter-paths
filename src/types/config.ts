//----------------------------------------------------------------------------------------------------------------------
// Configuration controlled via command-line parameters
//----------------------------------------------------------------------------------------------------------------------

export type Config = {
    readonly caseSensitive: boolean;
    readonly debug: boolean;
    readonly files: ReadonlyArray<string>;
    readonly normalizePaths: boolean;
    readonly printRules: boolean;
};
