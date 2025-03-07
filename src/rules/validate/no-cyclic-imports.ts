import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { comesFromArgv, comesFromFile, isImportFile } from "../helpers/rule-type-guards.js";

//----------------------------------------------------------------------------------------------------------------------
// Verify that files don't include one another recursively
//----------------------------------------------------------------------------------------------------------------------

export function assertNoCyclicImports(importRule: Rule.ImportFile) {
    const importRules = getImportRules(importRule);
    if (wasImportedBefore(importRules, importRule.file)) {
        fail(`Detected cyclic import of ${importRule.file.resolved}:\n\n${formatStack(importRules)}`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Extract all "import" rules from the given rule stack
//----------------------------------------------------------------------------------------------------------------------

function getImportRules(importRule: Rule.ImportFile) {
    const importRules = new Array<Rule.ImportFile>();
    for (let rule: Rule | undefined = importRule; rule; rule = rule.parent) {
        if (isImportFile(rule)) {
            importRules.push(rule);
        }
    }
    return importRules.reverse();
}

//----------------------------------------------------------------------------------------------------------------------
// Check if the current file has been imported before
//----------------------------------------------------------------------------------------------------------------------

function wasImportedBefore(importRules: ReadonlyArray<Rule.ImportFile>, file: Rule.Fragment.File) {
    return importRules.slice(0, importRules.length - 1).some(importRule => importRule.file.equals(file));
}

//----------------------------------------------------------------------------------------------------------------------
// Assemble a rule stack (for the error message)
//----------------------------------------------------------------------------------------------------------------------

function formatStack(importRules: ReadonlyArray<Rule.ImportFile>) {
    return importRules
        .filter(importRule => comesFromFile(importRule.source))
        .map(importRule => {
            if (comesFromArgv(importRule.source)) {
                return [importRule.source.argv.resolved];
            } else {
                return [
                    `${importRule.source.file.resolved} line ${importRule.source.lineNumber}:`,
                    `${importRule.source.line.trim()}`,
                ];
            }
        })
        .flatMap((array, index) => array.map(line => `${"".padEnd(index * 2)}${line}`))
        .join("\n");
}
