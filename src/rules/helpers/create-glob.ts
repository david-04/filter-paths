import picomatch from "picomatch";
import { Parameters } from "../../types/parameters.js";
import { RuleSource } from "../../types/rule-source.js";
import { Rule } from "../../types/rules.js";
import { assertGlobIsValid } from "../validate/valid-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Create the "glob" part of a rule
//----------------------------------------------------------------------------------------------------------------------

export function createGlob(
    parameters: Parameters,
    parent: Rule.Parent,
    rule: RuleSource.File,
    glob: string
): Rule.Internal.Glob {
    const original = glob.trim();
    assertGlobIsValid(rule, original);
    const atDirectory = "atDirectory" in parent ? parent.atDirectory : undefined;
    const effective = atDirectory?.effective.trim() ? getEffectiveGlob(atDirectory.effective, original) : original;
    const matches = getMatcher(parameters, effective);
    return { glob: { original, effective }, matches };
}

//----------------------------------------------------------------------------------------------------------------------
// Concatenate the glob with the parent's "at directory"
//----------------------------------------------------------------------------------------------------------------------

function getEffectiveGlob(atDirectory: string, glob: string) {
    return atDirectory?.trim() ? `${atDirectory.trim()}/${glob.replace(/^\//, "")}` : glob;
}

//----------------------------------------------------------------------------------------------------------------------
// Create a matcher
//----------------------------------------------------------------------------------------------------------------------

function getMatcher(parameters: Parameters, glob: string) {
    return picomatch(glob, { nocase: !parameters.caseSensitive });
}

// TODO: Revisit: this one only calculates "glob" - but we also need to calculate the "atDirectory" for the relevant rules
