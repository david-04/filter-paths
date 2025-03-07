import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { isArgv, isImportFile } from "../helpers/rule-type-guards.js";

//----------------------------------------------------------------------------------------------------------------------
// Verify that files don't include one another recursively
//----------------------------------------------------------------------------------------------------------------------

export function assertNoCyclicImports(importRule: Rule.ImportFile) {
    const rules = importRule.stack.filter(isImportFile).map(rule => rule);
    const [child, ...parents] = rules.slice(0).reverse();
    if (child && parents.some(parent => child.file.equals(parent.file))) {
        fail(importRule.source, `Cyclic import:\n\n${rules.map(formatStackLine).join("\n")}`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Format a single line in the import stack
//----------------------------------------------------------------------------------------------------------------------

function formatStackLine(rule: Rule.ImportFile, index: number) {
    const nestingIndicator = index ? "+- " : "";
    const indent = "".padEnd((index - 1) * nestingIndicator.length);
    const importRule = isArgv(rule.source)
        ? `${rule.file.original.trim()} (command-line argument)`
        : `${rule.source.line.trim()} (at line ${rule.source.lineNumber})`;
    return [indent, nestingIndicator, importRule].join("");
}
