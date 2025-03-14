import { Result } from "../../types/result.js";
import { Rule } from "../../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule type is "include glob"
//----------------------------------------------------------------------------------------------------------------------

export function isInclude(ruleType: Rule.Type | undefined): ruleType is Rule.Type.INCLUDE_GLOB {
    return ruleType === Rule.INCLUDE_GLOB;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "include glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function isIncludeGlob(rule: Rule): rule is Rule.IncludeGlob {
    return rule.type === Rule.INCLUDE_GLOB;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "include glob" or "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function isIncludeOrExcludeGlob(rule: Rule): rule is Rule.IncludeOrExcludeGlob {
    return [isIncludeGlob, isExcludeGlob].some(matches => matches(rule));
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule type is "exclude glob"
//----------------------------------------------------------------------------------------------------------------------

export function isExclude(ruleType: Rule.Type | undefined): ruleType is Rule.Type.EXCLUDE_GLOB {
    return ruleType === Rule.EXCLUDE_GLOB;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is an "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function isExcludeGlob(rule: Rule): rule is Rule.ExcludeGlob {
    return rule.type === Rule.EXCLUDE_GLOB;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule is a "directory scope" rule
//----------------------------------------------------------------------------------------------------------------------

export function isDirectoryScope(rule: Rule): rule is Rule.DirectoryScope {
    return rule.type === Rule.DIRECTORY_SCOPE;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a result is "final"
//----------------------------------------------------------------------------------------------------------------------

export function isFinal(result: Result | undefined): result is Result.Final {
    return result?.type === Result.FINAL;
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a rule or a result is a "goto"
//----------------------------------------------------------------------------------------------------------------------

export function isGoto<T extends Rule | Result>(
    ruleOrResult: T
): ruleOrResult is Exclude<T, Exclude<T, Rule.Goto | Result.Goto>> {
    return ruleOrResult && [Rule.GOTO, Result.GOTO].includes(ruleOrResult.type);
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
