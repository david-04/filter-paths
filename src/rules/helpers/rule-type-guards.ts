import { Rule } from "../../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "include or exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function isIncludeOrExcludeGlob(rule: Rule): rule is Rule.IncludeOrExcludeGlob {
    return [isIncludeGlob, isExcludeGlob].some(matches => matches(rule));
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "include glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function isIncludeGlob(ruleType: Rule.Type): ruleType is Rule.Type.INCLUDE_GLOB;
export function isIncludeGlob(rule: Rule): rule is Rule.IncludeGlob;
export function isIncludeGlob(ruleOrType: Rule | Rule.Type): boolean {
    return ("object" === typeof ruleOrType ? ruleOrType.type : ruleOrType) === Rule.INCLUDE_GLOB;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function isExcludeGlob(ruleType: Rule.Type): ruleType is Rule.Type.EXCLUDE_GLOB;
export function isExcludeGlob(rule: Rule): rule is Rule.ExcludeGlob;
export function isExcludeGlob(ruleOrType: Rule | Rule.Type): boolean {
    return ("object" === typeof ruleOrType ? ruleOrType.type : ruleOrType) === Rule.EXCLUDE_GLOB;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is a "directory scope" rule
//----------------------------------------------------------------------------------------------------------------------

export function isDirectoryScope(rule: Rule): rule is Rule.DirectoryScope {
    return rule.type === Rule.DIRECTORY_SCOPE;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is a "break" rule
//----------------------------------------------------------------------------------------------------------------------

export function isBreak(rule: Rule): rule is Rule.Break {
    return rule.type === Rule.BREAK;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "import file" rule
//----------------------------------------------------------------------------------------------------------------------

export function isImportFile(rule: Rule): rule is Rule.ImportFile {
    return rule.type === Rule.IMPORT_FILE;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if the rule represents a command-line parameter
//----------------------------------------------------------------------------------------------------------------------

export function isArgv(rule: Rule.Source): rule is Rule.Source.Argv {
    return rule.type === "argv";
}
