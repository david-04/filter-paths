import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { createGlob } from "../helpers/create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "directory scope" (@) rule
//----------------------------------------------------------------------------------------------------------------------

export function parseDirectoryScopeRule(config: Config, parent: Rule, source: Rule.Source.File, data: string) {
    const { secondaryAction, globData } = splitData(data);
    const directoryScope = createGlob(config, source, parent.directoryScope, globData);
    const glob = createGlob(config, source, directoryScope, "**");
    const stack = [...parent.stack];
    const rule: Rule.DirectoryScope = {
        directoryScope,
        children: [],
        glob,
        parent,
        secondaryAction,
        source,
        stack,
        stringified: toStringified(globData, secondaryAction, glob),
        type: Rule.DIRECTORY_SCOPE,
    };
    stack.push(rule);
    return rule;
}

//----------------------------------------------------------------------------------------------------------------------
// If present, extract the secondary action (include or exclude) from the glob
//----------------------------------------------------------------------------------------------------------------------

function splitData(data: string) {
    switch (data[0]) {
        case "+":
            return { secondaryAction: Rule.INCLUDE_GLOB, globData: data.slice(1).trim() } as const;
        case "-":
            return { secondaryAction: Rule.EXCLUDE_GLOB, globData: data.slice(1).trim() } as const;
        default:
            return { secondaryAction: undefined, globData: data.trim() } as const;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Get the stringified representation
//----------------------------------------------------------------------------------------------------------------------

function toStringified(
    original: string,
    secondaryAction: Rule.Type.IncludeOrExclude | undefined,
    glob: Rule.Fragment.Glob
): Rule.Fragment.Stringified {
    return {
        operator: { [Rule.INCLUDE_GLOB]: "@ +", [Rule.EXCLUDE_GLOB]: "@ -", "": "@" }[secondaryAction ?? ""],
        original,
        effective: glob.effective,
    };
}
