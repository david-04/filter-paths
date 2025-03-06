import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";

//----------------------------------------------------------------------------------------------------------------------
// Verify that files don't include one another recursively
//----------------------------------------------------------------------------------------------------------------------

export function assertNoCyclicImports(importRule: Rule.ImportFile) {
    const importRules = getImportRules(importRule);
    if (wasImportedBefore(importRules, importRule.file)) {
        fail(`Detected cyclic import of ${importRule.file}:\n\n${formatStack(importRules)}`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Extract all "import" rules from the given rule stack
//----------------------------------------------------------------------------------------------------------------------

function getImportRules(importRule: Rule.ImportFile) {
    const importRules = new Array<Rule.ImportFile>();
    for (let rule: Rule | undefined = importRule; rule; rule = rule.parent) {
        if (rule.type === Rule.IMPORT_FILE) {
            importRules.push(rule);
        }
    }
    return importRules.reverse();
}

//----------------------------------------------------------------------------------------------------------------------
// Check if the current file has been imported before
//----------------------------------------------------------------------------------------------------------------------

function wasImportedBefore(importRules: ReadonlyArray<Rule.ImportFile>, file: string) {
    return importRules.slice(0, importRules.length - 1).some(importRule => importRule.file === file);
}

//----------------------------------------------------------------------------------------------------------------------
// Assemble a rule stack (for the error message)
//----------------------------------------------------------------------------------------------------------------------

function formatStack(importRules: ReadonlyArray<Rule.ImportFile>) {
    return importRules
        .filter(importRule => importRule.source.type === "file")
        .map(importRule => {
            if (importRule.source.type === "argv") {
                return [importRule.source.argv];
            } else {
                return [
                    `${importRule.source.file} line ${importRule.source.lineNumber}:`,
                    `${importRule.source.line.trim()}`,
                ];
            }
        })
        .flatMap((array, index) => array.map(line => `${"".padEnd(index * 2)}${line}`))
        .join("\n");
}
