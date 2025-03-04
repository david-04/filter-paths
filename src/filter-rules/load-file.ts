import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, resolve } from "node:path";
import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { fail } from "../utils/fail.js";
import { parseRules } from "./parse-rules.js";
import { ImportFileRule, Rule, RuleSource, RuleType } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Load and parse given file
//----------------------------------------------------------------------------------------------------------------------

export function loadFile(commandLineParameters: CommandLineParameters, file: string, parent: Rule): void;
export function loadFile(commandLineParameters: CommandLineParameters, file: string): ReadonlyArray<Rule>;
export function loadFile(commandLineParameters: CommandLineParameters, file: string, parent?: Rule) {
    file = resolvePath(parent, file);
    assertNoCyclicImports(parent);
    assertFileExists(file, parent);
    const lines = loadLines(parent?.source, file);
    return parseRules(commandLineParameters, parent, lines);
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that files don't include one another recursively
//----------------------------------------------------------------------------------------------------------------------

function assertNoCyclicImports(parent: Rule | undefined) {
    for (let current = parent; current; current = current.parent) {
        if (current.type === RuleType.IMPORT_FILE) {
            assertNoCyclicImportsForInnerParent(current);
        }
    }
}

function assertNoCyclicImportsForInnerParent(child: ImportFileRule) {
    for (let parent = child.parent; parent; parent = parent.parent) {
        if (parent.type === RuleType.IMPORT_FILE && resolve(child.file) === resolve(parent.file)) {
            const context = [parent.source, child.source].flatMap(source =>
                source ? [source.file, `${source.lineNumber}: ${source.line.trim()}`] : []
            );
            fail(["Detected cyclic/recursive include directives:", ...context].join("\n"));
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Resole the path
//----------------------------------------------------------------------------------------------------------------------

function resolvePath(parent: Rule | undefined, path: string) {
    path = normalizePath(expandEnvironmentVariables(path));
    if (isAbsolute(path)) {
        return path;
    }
    const parentPath = parent?.source?.file ? normalize(dirname(parent.source.file)) : undefined;
    if (parentPath) {
        return normalize(join(parentPath, path));
    }
    return path;
}

//----------------------------------------------------------------------------------------------------------------------
// Resolve environment variables
//----------------------------------------------------------------------------------------------------------------------

export function expandEnvironmentVariables(path: string) {
    return path.replace(/\${([^}]+)}/g, placeholder => {
        const name = placeholder.replace(/^\$\{/, "").replace(/\}$/, "").trim();
        if (!name) {
            return fail(`Missing environment variable name in path: ${path}`);
        } else {
            return process.env[name] ?? fail(`Environment variable ${placeholder} is not set`);
        }
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Normalize a path
//----------------------------------------------------------------------------------------------------------------------

export function normalizePath(path: string) {
    return normalize(path).replaceAll("\\", "/");
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
