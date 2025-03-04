import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { createGlob } from "./create-glob.js";
import { ExcludePathRule, IncludePathRule, ParentRule, RuleSource, RuleType } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseIncludePathRule(
    commandLineParameters: CommandLineParameters,
    parent: ParentRule,
    source: RuleSource,
    _operator: string,
    data: string
): IncludePathRule {
    return {
        atDirectory: parent?.atDirectory,
        children: [],
        parent,
        source,
        type: RuleType.INCLUDE_PATH,
        ...createGlob(commandLineParameters, parent, source, data),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Parse an "exclude path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseExcludePathRule(
    commandLineParameters: CommandLineParameters,
    parent: ParentRule,
    source: RuleSource,
    _operator: string,
    data: string
): ExcludePathRule {
    return {
        atDirectory: parent?.atDirectory,
        children: [],
        parent,
        source,
        type: RuleType.EXCLUDE_PATH,
        ...createGlob(commandLineParameters, parent, source, data),
    };
}
