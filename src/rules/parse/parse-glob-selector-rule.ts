import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { createGlob } from "./create-glob.js";

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
    const { directoryScope } = parent;
    const glob = createGlob(config, source, directoryScope, data);
    return { directoryScope, children: [], parent, source, type, glob };
}
