import picomatch from "picomatch";
import { Parameters } from "../../types/parameters.js";
import { GlobRule, ParentRule, RuleBase, RuleSource } from "../../types/rule-types.js";
import { fail } from "../../utils/fail.js";

//----------------------------------------------------------------------------------------------------------------------
// Create the "glob" part of a rule
//----------------------------------------------------------------------------------------------------------------------

export function createGlob(
    parameters: Parameters,
    parent: ParentRule,
    source: RuleSource,
    data: string
): Omit<GlobRule, keyof RuleBase> {
    const raw = data.trim();
    assertGlobIsValid(source, raw);
    const withAtDirectory = concatenateGlobs(parent?.atDirectory, raw);
    const matcher = createMatcher(parameters, withAtDirectory);
    return { glob: { raw, withAtDirectory }, matcher };
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that the glob is not empty and starts with "/" or "**"
//----------------------------------------------------------------------------------------------------------------------

function assertGlobIsValid(source: RuleSource, glob: string) {
    if (!glob) {
        fail(source, "Missing glob pattern");
    }
    if (!glob.startsWith("/") && !glob.startsWith("**")) {
        fail(source, 'Each glob must either start with "/" or "**"');
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Concatenate the glob with the parent's "at directory"
//----------------------------------------------------------------------------------------------------------------------

function concatenateGlobs(atDirectory: string | undefined, glob: string) {
    return atDirectory?.trim() ? `${atDirectory.trim()}/${glob.replace(/^\//, "")}` : glob;
}

//----------------------------------------------------------------------------------------------------------------------
// Create a matcher
//----------------------------------------------------------------------------------------------------------------------

function createMatcher(parameters: Parameters, glob: string) {
    return picomatch(glob, { nocase: !parameters.caseSensitive });
}
