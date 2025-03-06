import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { getEffectiveGlob, getGlobMatcher } from "../helpers/create-glob.js";
import { assertGlobIsValid } from "../validate/valid-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "directory scope" (@) rule
//----------------------------------------------------------------------------------------------------------------------

export function parseDirectoryScopeRule(
    parameters: Parameters,
    parent: Rule,
    source: RuleSource.File,
    _operator: string,
    data: string
): Rule.DirectoryScope {
    const { effectiveData, secondaryAction } = splitData(data);
    assertGlobIsValid(source, effectiveData);
    const directoryScope = getDirectoryScope(parent, effectiveData);
    const glob = getGlob(parameters, directoryScope);

    return {
        directoryScope,
        children: [],
        glob,
        parent,
        secondaryAction,
        source,
        type: Rule.DIRECTORY_SCOPE,
        ...getGlob(parameters, directoryScope),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Extract the secondary action (include or exclude) from the glob
//----------------------------------------------------------------------------------------------------------------------

function splitData(data: string) {
    const match = /^([-+]) (.*)$/.exec(data);
    const operator = match?.[1]?.trim() ?? "";
    const glob = match?.[2]?.trim() ?? "";
    if (glob && "+" === operator) {
        return { effectiveData: glob, secondaryAction: Rule.INCLUDE_GLOB } as const;
    } else if (glob && "-" === operator) {
        return { effectiveData: glob, secondaryAction: Rule.EXCLUDE_GLOB } as const;
    } else {
        return { effectiveData: data, secondaryAction: undefined } as const;
    }
}

function getDirectoryScope(parent: Rule, glob: string) {
    const effective = parent.directoryScope?.effective
        ? getEffectiveGlob(parent.directoryScope?.effective, glob)
        : glob;
    return { original: glob, effective };
}

//----------------------------------------------------------------------------------------------------------------------
// Build the "at-directory" property
//----------------------------------------------------------------------------------------------------------------------

function getGlob(parameters: Parameters, directoryScope: Rule.DirectoryScope["directoryScope"]) {
    const effective = getEffectiveGlob(directoryScope.effective, "/**");
    const original = getEffectiveGlob(directoryScope.original, "/**");
    const matches = getGlobMatcher(parameters, effective);
    return { effective, original, matches } as const;
}
