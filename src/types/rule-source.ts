//----------------------------------------------------------------------------------------------------------------------
// Base properties for all rules
//----------------------------------------------------------------------------------------------------------------------

export namespace RuleSource {
    export type File = {
        readonly file: string;
        readonly indentation: number;
        readonly line: string;
        readonly lineNumber: number;
        readonly parent: RuleSource | undefined;
        readonly type: "file";
    };

    export type Argv = {
        readonly argv: string;
        readonly type: "argv";
    };
}

export type RuleSource = RuleSource.File | RuleSource.Argv;
