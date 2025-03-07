import picomatch from "picomatch";
import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";

//----------------------------------------------------------------------------------------------------------------------
// Create a matcher
//----------------------------------------------------------------------------------------------------------------------

export function createGlobMatcher(config: Config, source: Rule.Source.File, glob: string) {
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
