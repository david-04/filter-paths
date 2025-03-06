import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname } from "node:path";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { resolvePath } from "../../utils/path.js";
import { assertNoCyclicImport } from "../validate/no-cyclic-imports.js";

//----------------------------------------------------------------------------------------------------------------------
// Load and parse given file
//----------------------------------------------------------------------------------------------------------------------

export function loadFile(parent: Rule.ImportFile, file: string) {
    const resolvedFile =
        parent.source.type === "file" ? resolvePath(dirname(parent.source.file), file) : resolvePath(file);
    assertFileExists(resolvedFile, parent.source);
    assertNoCyclicImport(parent);
    return loadLines(parent.source, resolvedFile);
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the file exists
//----------------------------------------------------------------------------------------------------------------------

function assertFileExists(file: string, source: Rule.Source) {
    const includedIn = source.type === "file" ? ` (included in ${source.file} at line ${source.lineNumber})` : "";
    if (!existsSync(file)) {
        fail(`File ${file}${includedIn} does not exist`);
    } else if (!statSync(file).isFile()) {
        fail(`${file}${includedIn} is not a file`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Parse a single file
//----------------------------------------------------------------------------------------------------------------------

function loadLines(parent: Rule.Source, file: string) {
    return readFileSync(file)
        .toString()
        .split(/\r?\n/)
        .map((line, index) => ({ file, line, lineNumber: index + 1 }))
        .filter(item => !/^\s*(#.*)?$/.test(item.line))
        .map((item): Rule.Source.File => ({ ...item, indentation: -1, parent, type: "file" }))
        .map((item): Rule.Source.File => ({ ...item, indentation: getIndentation(item) }));
}

//----------------------------------------------------------------------------------------------------------------------
// Calculate the indentation
//----------------------------------------------------------------------------------------------------------------------

function getIndentation(rule: Rule.Source.File) {
    const leadingWhitespace = rule.line.replace(/[^\s].*$/, "");
    const leadingArrows = (/^[^\sa-z\d]*</i.exec(rule.line.trim())?.[0] ?? "").replace(/<$/, "");
    if (0 <= leadingWhitespace.indexOf("\t")) {
        fail(rule, "The line contains leading tabs. Filter rules must be indented with spaces only.");
    }
    return leadingWhitespace.length + leadingArrows.length;
}
