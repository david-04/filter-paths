import { Config } from "../../types/config.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { getEffectiveGlob, getGlobMatcher } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include glob" or "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseGlobSelectorRule(
    config: Config,
    parent: Rule,
    source: RuleSource.File,
    operator: string,
    data: string
): Rule.IncludeOrExcludeGlob {
    if (["+", "-"].includes(operator)) {
        const directoryScope = "directoryScope" in parent ? parent.directoryScope : undefined;
        const original = data.trim();
        const effective = getEffectiveGlob(directoryScope?.effective, original);
        const matches = getGlobMatcher(config, effective);
        return {
            directoryScope,
            children: [],
            parent,
            source,
            type: "+" === operator ? Rule.INCLUDE_GLOB : Rule.EXCLUDE_GLOB,
            glob: { original, effective, matches },
        };
    } else {
        throw new Error(
            `Internal error: Invalid operator ${operator} passed to parseGlobSelectorRule (expected "+" or "-")`
        );
    }
}
