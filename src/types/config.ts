//----------------------------------------------------------------------------------------------------------------------
// Configuration controlled via command-line parameters
//----------------------------------------------------------------------------------------------------------------------

export type Config = {
    readonly caseSensitive: boolean;
    readonly debug: boolean;
    readonly files: ReadonlyArray<string>;
    readonly normalizeOutput: boolean;
    readonly printRules: boolean;
    readonly testFixtures: ReadonlyMap<string, string> | undefined;
};
