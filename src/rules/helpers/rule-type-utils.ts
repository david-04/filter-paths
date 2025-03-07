import { Rule } from "../../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "include or exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function isIncludeOrExcludeGlob(rule: Rule): rule is Rule.IncludeOrExclude {
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
// Check if a rule is a "goto" rule
//----------------------------------------------------------------------------------------------------------------------

export function isGoto(rule: Rule): rule is Rule.Goto {
    return rule.type === Rule.GOTO;
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

//----------------------------------------------------------------------------------------------------------------------
// Check if the rule comes from a file (rather than a command-line parameter)
//----------------------------------------------------------------------------------------------------------------------

export function isFile(rule: Rule.Source): rule is Rule.Source.File {
    return rule.type === "file";
}

//----------------------------------------------------------------------------------------------------------------------
// Flip between "include" and "exclude"
//----------------------------------------------------------------------------------------------------------------------

export function invert(include: Rule.Type.INCLUDE_GLOB): Rule.Type.EXCLUDE_GLOB;
export function invert(exclude: Rule.Type.EXCLUDE_GLOB): Rule.Type.INCLUDE_GLOB;
export function invert(exclude: Rule.Type.IncludeOrExclude): Rule.Type.IncludeOrExclude;
export function invert(type: Rule.Type.IncludeOrExclude): Rule.Type.IncludeOrExclude {
    return type === Rule.INCLUDE_GLOB ? Rule.EXCLUDE_GLOB : Rule.INCLUDE_GLOB;
}
