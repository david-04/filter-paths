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
    parent: Rule.Parent,
    source: RuleSource.File,
    _operator: string,
    data: string
): Rule.AtDirectory {
    const { glob, secondaryAction } = getGlobAndSecondaryAction(data);
    assertGlobIsValid(source, glob);
    const parentGlob = "atDirectory" in parent ? parent.atDirectory?.effective : undefined;
    const atDirectory = { original: glob, effective: getEffectiveGlob(parentGlob, glob) } as const;

    return {
        atDirectory,
        children: [],
        parent,
        secondaryAction,
        source,
        type: Rule.AT_DIRECTORY,
        ...getGlobAndMatcher(parameters, atDirectory),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Extract the secondary action
//----------------------------------------------------------------------------------------------------------------------

function getGlobAndSecondaryAction(data: string) {
    const match = /^([-+]) (.*)$/.exec(data);
    const operator = match?.[1]?.trim() ?? "";
    const glob = match?.[2]?.trim() ?? "";
    if (glob && "+" === operator) {
        return { glob, secondaryAction: Rule.INCLUDE_GLOB } as const;
    } else if (glob && "-" === operator) {
        return { glob, secondaryAction: Rule.EXCLUDE_GLOB } as const;
    } else {
        return { glob: data, secondaryAction: undefined } as const;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Build the "at-directory" property
//----------------------------------------------------------------------------------------------------------------------

function getGlobAndMatcher(parameters: Parameters, atDirectory: Rule.AtDirectory["atDirectory"]) {
    const glob = {
        effective: getEffectiveGlob(atDirectory.effective, "/**"),
        original: getEffectiveGlob(atDirectory.original, "/**"),
    } as const;
    const matches = getGlobMatcher(parameters, glob.effective);
    return { glob, matches } as const;
}
