import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { getEffectiveGlob, getGlobMatcher } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include glob" or "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseGlobSelectorRule(
    parameters: Parameters,
    parent: Rule.Parent,
    source: RuleSource.File,
    operator: string,
    data: string
): Rule.GlobSelector {
    if (["+", "-"].includes(operator)) {
        const atDirectory = "atDirectory" in parent ? parent.atDirectory : undefined;
        const original = data.trim();
        const effective = getEffectiveGlob(atDirectory?.effective, original);
        return {
            atDirectory: "atDirectory" in parent ? parent.atDirectory : undefined,
            children: [],
            parent,
            source,
            type: "+" === operator ? Rule.INCLUDE_GLOB : Rule.EXCLUDE_GLOB,
            glob: { original, effective },
            matches: getGlobMatcher(parameters, effective),
        };
    } else {
        throw new Error(
            `Internal error: Invalid operator ${operator} passed to parseGlobSelectorRule (expected "+" or "-")`
        );
    }
}
