import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, resolve } from "node:path";
import { Parameters } from "../../types/parameters.js";
import { Rule, RuleSource, RuleType } from "../../types/rule-types.js";
import { fail } from "../../utils/fail.js";
import { parseRules } from "../parse/parse-rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Load and parse given file
//----------------------------------------------------------------------------------------------------------------------

export function loadFile(parameters: Parameters, file: string, parent: Rule): void;
export function loadFile(parameters: Parameters, file: string): ReadonlyArray<Rule>;
export function loadFile(parameters: Parameters, file: string, parent?: Rule) {
    file = resolvePath(parent, file);
    assertFileExists(file, parent);
    assertNoCyclicImports(parent, file);
    const lines = loadLines(parent?.source, file);
    return parseRules(parameters, parent, lines);
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that files don't include one another recursively
//----------------------------------------------------------------------------------------------------------------------

function assertNoCyclicImports(parent: Rule | undefined, file: string) {
    for (let current: Rule | undefined = parent; current; current = current.parent) {
        if (current.source?.file && resolve(current.source.file) === resolve(file)) {
            const message = `Detected cyclic inclusion of ${file}`;
            const stack = getImportStack(parent).map((line, index) => `${"".padEnd(index * 2)}${line}`);
            const combined = !stack.length ? [message] : [`${message}:`, "", ...stack];
            fail(combined.join("\n"));
        }
    }
}

function getImportStack(parent: Rule | undefined) {
    const stack = new Array<string>();
    for (let current: Rule | undefined = parent; current; current = current.parent) {
        if (!current.parent) {
            if (current.type === RuleType.IMPORT_FILE) {
                stack.push(current.file);
            } else if (current.source) {
                stack.push(current.source.file.trim());
            }
        } else if (current.type === RuleType.IMPORT_FILE) {
            stack.push(current.source ? current.source.line.trim() : current.file);
        }
    }
    return stack.reverse();
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
