import { readFileSync } from "fs";
import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { createFileDescriptor } from "../helpers/create-file-descriptor.js";
import { isFile } from "../helpers/rule-type-utils.js";
import { assertFileExists } from "../validate/file-exists.js";
import { assertNoCyclicImports } from "../validate/no-cyclic-imports.js";
import { parseRules } from "./parse-rules.js";
import { getGotoRuleOperator } from "../helpers/goto-rule-operator.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "import file" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseImportFileRule({ config, file, operator, parent, source }: parseImportFileRule.Args) {
    const stack = [...(parent?.stack ?? [])];
    const rule: Rule.ImportFile = {
        directoryScope: parent?.directoryScope,
        children: [],
        file,
        parent,
        source,
        stack,
        stringified: getStringified(operator, file),
        type: Rule.IMPORT_FILE,
    };
    assertFileExists(source, file);
    assertNoCyclicImports(rule);
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
        const file = createFileDescriptor(isFile(parent.source) ? parent.source.file : undefined, data);
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

function getStringified(operator: string | undefined, file: Rule.Fragment.File): Rule.Fragment.Stringified {
    return {
        operator: operator ? `${operator}` : "",
        original: file.original,
        effective: file.resolved,
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Load and parse given file
//----------------------------------------------------------------------------------------------------------------------

function loadFile(parent: Rule.ImportFile, file: Rule.Fragment.File): ReadonlyArray<Rule.Source.File> {
    return loadLines(parent.source, file)
        .map((line, index) => ({ file, line, lineNumber: index + 1 }))
        .filter(item => !/^\s*(#.*)?$/.test(item.line))
        .map(item => ({ ...item, indentation: -1, parent: parent.source, type: "file" }) as const)
        .map(item => ({ ...item, indentation: getIndentation(item) }));
}

//----------------------------------------------------------------------------------------------------------------------
// Parse a single file
//----------------------------------------------------------------------------------------------------------------------

function loadLines(source: Rule.Source, file: Rule.Fragment.File) {
    try {
        return readFileSync(file.resolved).toString().split(/\r?\n/);
    } catch (error) {
        return fail(source, `Failed to load file ${file.absolute}\n${error}`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Calculate the indentation
//----------------------------------------------------------------------------------------------------------------------

function getIndentation(rule: Rule.Source.File) {
    const leadingWhitespace = rule.line.replace(/[^\s].*$/, "");
    if (0 <= leadingWhitespace.indexOf("\t")) {
        fail(rule, "The line contains leading tabs. Rules must be indented with spaces only.");
    }
    const gotoOperatorLength = getGotoRuleOperator(rule.line.trim())?.length ?? 0;
    return leadingWhitespace.length + Math.max(0, gotoOperatorLength - 1);
}
