import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { createGlob } from "../helpers/create-glob.js";
import { isInclude } from "../helpers/rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "include glob" or "exclude glob" rule
//----------------------------------------------------------------------------------------------------------------------

export function parseIncludeOrExcludeGlobRule(
    config: Config,
    parent: Rule,
    source: Rule.Source.File,
    type: Rule.Type.IncludeOrExclude,
    data: string
) {
    const { directoryScope } = parent;
    const glob = createGlob(config, source, directoryScope, data);
    const stack = [...parent.stack];
    const rule: Rule.IncludeOrExcludeGlob = {
        directoryScope,
        children: [],
        parent,
        source,
        stack,
        stringified: toStringified(type, data, glob),
        type,
        glob,
    };
    stack.push(rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the stringified representation
//----------------------------------------------------------------------------------------------------------------------

function toStringified(
    type: Rule.Type.IncludeOrExclude,
    data: string,
    glob: Rule.Fragment.Glob
): Rule.Fragment.Stringified {
    return {
        operator: isInclude(type) ? "+" : "-",
        original: data,
        effective: glob.effective,
    };
}
