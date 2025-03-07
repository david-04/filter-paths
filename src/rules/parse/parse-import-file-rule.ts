import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { createFileDescriptor } from "../helpers/create-file-descriptor.js";
import { comesFromFile } from "../helpers/rule-type-guards.js";
import { loadFile } from "../load/load-file.js";
import { parseRules } from "./parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "import file" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule({ config, file, operator, parent, source }: parseImportFileRule.Args) {
    const stack = [...(parent?.stack ?? [])];
    const rule: Rule.ImportFile = {
        directoryScope: parent?.directoryScope,
        children: [],
        file: file,
        parent: parent,
        source: source,
        stack,
        stringified: getStringified(operator, file),
        type: Rule.IMPORT_FILE,
    };
    stack.push(rule);
    parseRules(config, rule, loadFile(rule, file));
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// API
//----------------------------------------------------------------------------------------------------------------------

export namespace parseImportFileRule {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Rule parser arguments
    //------------------------------------------------------------------------------------------------------------------

    export type Args = {
        readonly config: Config;
        readonly file: Rule.Fragment.File;
        readonly operator?: string;
        readonly parent?: Rule;
        readonly source: Rule.Source;
    };

    //------------------------------------------------------------------------------------------------------------------
    // Parse an "import file" rule from an explicit "import/input" statement in a file
    //------------------------------------------------------------------------------------------------------------------

    export function fromFile(config: Config, parent: Rule, source: Rule.Source, operator: string, data: string) {
        const file = createFileDescriptor(comesFromFile(parent.source) ? parent.source.file : undefined, data);
        return parseImportFileRule({ config, file, parent, operator, source });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Parse an "import file" rule from a file specified in the command line
    //------------------------------------------------------------------------------------------------------------------

    export function fromArgv(config: Config, file: Rule.Fragment.File) {
        const source = { type: "argv", argv: file } as const;
        return parseImportFileRule({ config, file, source });
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Get the stringified representation
//----------------------------------------------------------------------------------------------------------------------

function getStringified(operator: string | undefined, file: Rule.Fragment.File) {
    operator = operator ? `${operator} ` : "";
    return {
        original: `${operator} ${file.original}`,
        effective: `${operator} ${file.resolved}`,
    };
}
