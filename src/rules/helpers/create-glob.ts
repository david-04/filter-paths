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
    const matches = createGlobMatcherForSource(config, source, effective);
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

function createGlobMatcherForSource(config: Config, source: Rule.Source.File, glob: string) {
    try {
        return createGlobMatcher(config, glob);
    } catch (error) {
        return fail(source, `Invalid glob pattern: ${glob}\n${error}`);
    }
}
export function createGlobMatcher(config: Config, glob: string) {
    return picomatch(glob, {
        basename: false,
        bash: false,
        capture: false,
        contains: false,
        debug: undefined,
        dot: true, // match file and directory names that start with a dot
        failglob: true,
        fastpaths: true,
        flags: undefined,
        ignore: undefined,
        keepQuotes: false,
        literalBrackets: false,
        maxLength: 65536,
        nobrace: false,
        nobracket: false,
        nocase: !config.caseSensitive, // case-sensitive or -insensitive comparison
        noextglob: undefined,
        noglobstar: false,
        nonegate: true, // disallow negated globs that start with "!"
        noquantifiers: false,
        posix: false,
        posixSlashes: false,
        prepend: undefined,
        regex: false,
        strictBrackets: true,
        strictSlashes: undefined,
        unescape: undefined,
        windows: false,
    });
}
