import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { createGlob } from "../helpers/create-glob.js";
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
    const { glob, secondaryAction } = splitData(data);
    assertGlobIsValid(source, glob);
    const atDirectory = getAtDirectory(parent, glob);

    return {
        atDirectory,
        children: [],
        parent,
        secondaryAction,
        source,
        type: Rule.AT_DIRECTORY,
        ...createGlob(parameters, parent, source, glob),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Extract the secondary action
//----------------------------------------------------------------------------------------------------------------------

function splitData(data: string) {
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

function getAtDirectory(parent: Rule.Parent, glob: string) {
    const parentGlob = "atDirectory" in parent ? parent.atDirectory?.effective : undefined;
    const effective = parentGlob ? concatenateGlobs(parentGlob, glob) : glob;
    return { original: glob, effective } as const;
}

//----------------------------------------------------------------------------------------------------------------------
// Join two globs
//----------------------------------------------------------------------------------------------------------------------

function concatenateGlobs(parent: string, child: string) {
    const separator = parent.endsWith("/") || child.startsWith("/") ? "" : "/";
    return `${parent}${separator}${child}`;
}
