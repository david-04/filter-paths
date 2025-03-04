import { existsSync, readFileSync, statSync } from "node:fs";
import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { fail } from "../utils/fail.js";
import { parseRules } from "./parse-rules.js";
import { Rule, RuleSource } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Load and parse given file
//----------------------------------------------------------------------------------------------------------------------

export function loadFile(commandLineParameters: CommandLineParameters, file: string, parent: Rule): void;
export function loadFile(commandLineParameters: CommandLineParameters, file: string): ReadonlyArray<Rule>;
export function loadFile(commandLineParameters: CommandLineParameters, file: string, parent?: Rule) {
    assertFileExists(file, parent);
    const lines = loadLines(parent?.source, file);
    return parseRules(commandLineParameters, parent, lines);
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the file exists
//----------------------------------------------------------------------------------------------------------------------

function assertFileExists(file: string, parent: Rule | undefined) {
    const includedFrom = getIncludedFromMessage(parent?.source);
    if (!existsSync(file)) {
        fail(`File ${file}${includedFrom} does not exist`);
    }
    if (!statSync(file).isFile()) {
        fail(`${file}${includedFrom} is not a file`);
    }
}

function getIncludedFromMessage(source: RuleSource | undefined) {
    const { file, lineNumber } = source ?? {};
    if (file) {
        return lineNumber ? ` (included from ${file} at line ${lineNumber})` : ` (included from ${file})`;
    }
    return "";
}

//----------------------------------------------------------------------------------------------------------------------
// Parse a single file
//----------------------------------------------------------------------------------------------------------------------

function loadLines(parent: RuleSource | undefined, file: string): ReadonlyArray<RuleSource> {
    return readFileSync(file)
        .toString()
        .split(/\r?\n/)
        .map((line, index) => ({ file, line, lineNumber: index + 1 }))
        .filter(item => !/^\s*(#.*)?$/.test(item.line))
        .map(item => ({ ...item, indentation: getIndentation(item), parent }));
}

//----------------------------------------------------------------------------------------------------------------------
// Calculate the indentation
//----------------------------------------------------------------------------------------------------------------------

function getIndentation(item: { readonly file: string; readonly line: string; readonly lineNumber: number }) {
    const leadingWhitespace = item.line.replace(/[^\s].*$/, "");
    const leadingArrows = (/^<+/.exec(item.line.trim())?.[0] ?? "").replace(/<$/, "");
    if (0 <= leadingWhitespace.indexOf("\t")) {
        const message = [
            `The rule in ${item.file} at line ${item.lineNumber} contains leading tabs:`,
            item.line,
            "Filter rules must be indented with spaces only.",
        ];
        fail(message.join("\n"));
    }
    return leadingWhitespace.length + leadingArrows.length;
}
