import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { getEffectiveGlob, getGlobMatcher } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include glob" or "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseGlobSelectorRule(
    config: Config,
    parent: Rule,
    source: Rule.Source.File,
    type: Rule.IncludeOrExclude,
    data: string
): Rule.IncludeOrExcludeGlob {
    const directoryScope = "directoryScope" in parent ? parent.directoryScope : undefined;
    const original = data.trim();
    const effective = getEffectiveGlob(directoryScope?.effective, original);
    const matches = getGlobMatcher(config, effective);
    return {
        directoryScope,
        children: [],
        parent,
        source,
        type,
        glob: { original, effective, matches },
    };
}
