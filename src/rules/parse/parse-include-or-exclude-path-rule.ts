import { Parameters } from "../../types/parameters.js";
import { ExcludePathRule, IncludePathRule, ParentRule, RuleSource, RuleType } from "../../types/rule-types.js";
import { createGlob } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseIncludePathRule(
    parameters: Parameters,
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
        ...createGlob(parameters, parent, source, data),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Parse an "exclude path" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseExcludePathRule(
    parameters: Parameters,
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
        ...createGlob(parameters, parent, source, data),
    };
}
