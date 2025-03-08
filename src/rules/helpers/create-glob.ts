import picomatch from "picomatch";
import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { assertGlobIsValid } from "../validate/valid-glob.js";

//----------------------------------------------------------------------------------------------------------------------
// Create a glob with a matcher
//----------------------------------------------------------------------------------------------------------------------

export function createGlob(
    config: Config,
    source: Rule.Source.File,
    directoryScope: Rule.Fragment.DirectoryScope | undefined,
    glob: string
) {
    const original = assembleGlob(undefined, glob);
    const effective = assembleGlob(directoryScope?.effective, glob);
    [glob, original, effective].forEach(glob => assertGlobIsValid(source, glob));
    const matches = createGlobMatcher(config, source, effective);
    return { original, effective, matches };
}

//----------------------------------------------------------------------------------------------------------------------
// Concatenate parent and child globs
//----------------------------------------------------------------------------------------------------------------------

function assembleGlob(parent: string | undefined, child: string) {
    if (parent) {
        const separator = child.startsWith("/") || parent.endsWith("/") ? "" : "/";
        return [parent, separator, child].join("");
    } else {
        return child;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Create a matcher
//----------------------------------------------------------------------------------------------------------------------

function createGlobMatcher(config: Config, source: Rule.Source.File, glob: string) {
    try {
        return picomatch(glob, {
            dot: true, // match file and directory names that start with a dot
            nocase: !config.caseSensitive, // case-sensitive or -insensitive comparison
            nonegate: true, // disallow negated globs that start with "!"
            strictBrackets: true, // throw an error if brackets, braces, or parens are imbalanced
        });
    } catch (error) {
        return fail(source, `Invalid glob pattern: ${glob}\n${error}`);
    }
}
