import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { getEffectiveGlob, getGlobMatcher } from "../helpers/create-glob.js";
import { assertGlobIsValid } from "../validate/valid-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Parse an "at-directory" (@) rule
//----------------------------------------------------------------------------------------------------------------------

export function parseAtDirectoryRule(
    parameters: Parameters,
    parent: Rule,
    source: RuleSource.File,
    _operator: string,
    data: string
): Rule.AtDirectory {
    const { effectiveData, secondaryAction } = splitData(data);
    assertGlobIsValid(source, effectiveData);
    const atDirectory = getAtDirectory(parent, effectiveData);
    const glob = getGlob(parameters, atDirectory);

    return {
        atDirectory,
        children: [],
        glob,
        parent,
        secondaryAction,
        source,
        type: Rule.AT_DIRECTORY,
        ...getGlob(parameters, atDirectory),
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

function getAtDirectory(parent: Rule, glob: string) {
    const effective = parent.atDirectory?.effective ? getEffectiveGlob(parent.atDirectory?.effective, glob) : glob;
    return { original: glob, effective };
}

//----------------------------------------------------------------------------------------------------------------------
// Build the "at-directory" property
//----------------------------------------------------------------------------------------------------------------------

function getGlob(parameters: Parameters, atDirectory: Rule.AtDirectory["atDirectory"]) {
    const effective = getEffectiveGlob(atDirectory.effective, "/**");
    const original = getEffectiveGlob(atDirectory.original, "/**");
    const matches = getGlobMatcher(parameters, effective);
    return { effective, original, matches } as const;
}
