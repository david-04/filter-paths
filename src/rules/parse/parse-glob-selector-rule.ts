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
) {
    const { directoryScope } = parent;
    const glob = createGlob(config, source, directoryScope, data);
    const stack = [...parent.stack];
    const rule: Rule.IncludeOrExcludeGlob = { directoryScope, children: [], parent, source, stack, type, glob };
    stack.push(rule);
    return rule;
}
