import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { assertGlobIsValid } from "../validate/valid-glob.js";
import { createGlob } from "./create-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "directory scope" (@) rule
//----------------------------------------------------------------------------------------------------------------------

export function parseDirectoryScopeRule(
    config: Config,
    parent: Rule,
    source: Rule.Source.File,
    data: string
): Rule.DirectoryScope {
    const { secondaryAction, globData } = splitData(data);
    assertGlobIsValid(source, globData);
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
