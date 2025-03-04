import picomatch from "picomatch";
import { CommandLineParameters } from "../cli/command-line-parameters.js";
import { fail } from "../utils/fail.js";
import { GlobRule, ParentRule, RuleBase, RuleSource } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Create the "glob" part of a rule
//----------------------------------------------------------------------------------------------------------------------

export function createGlob(
    commandLineParameters: CommandLineParameters,
    parent: ParentRule,
    source: RuleSource,
    data: string
): Omit<GlobRule, keyof RuleBase> {
    const raw = data.trim();
    assertGlobIsValid(source, raw);
    const withAtDirectory = concatenateGlobs(parent?.atDirectory, raw);
    const matcher = createMatcher(commandLineParameters, withAtDirectory);
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

function createMatcher(commandLineParameters: CommandLineParameters, glob: string) {
    return picomatch(glob, { nocase: !commandLineParameters.caseSensitive });
}
