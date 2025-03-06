import { readFileSync } from "node:fs";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { assertFileExists } from "../validate/file-exists.js";
import { assertNoCyclicImports } from "../validate/no-cyclic-imports.js";

//----------------------------------------------------------------------------------------------------------------------
// Load and parse given file
//----------------------------------------------------------------------------------------------------------------------

export function loadFile(parent: Rule.ImportFile, file: Rule.Fragment.File): ReadonlyArray<Rule.Source.File> {
    assertFileExists(parent.source, file);
    assertNoCyclicImports(parent);
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
    const leadingArrows = (/^[^\sa-z\d]*</i.exec(rule.line.trim())?.[0] ?? "").replace(/<$/, "");
    if (0 <= leadingWhitespace.indexOf("\t")) {
        fail(rule, "The line contains leading tabs. Filter rules must be indented with spaces only.");
    }
    return leadingWhitespace.length + leadingArrows.length;
}
