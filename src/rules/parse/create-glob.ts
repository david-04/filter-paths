import picomatch from "picomatch";
import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
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
    const original = assembleGlob(directoryScope?.original, glob);
    const effective = assembleGlob(directoryScope?.effective, glob);
    [glob, original, effective].forEach(glob => assertGlobIsValid(source, glob));
    const matches = picomatch(effective, { nocase: !config.caseSensitive });
    return { original, effective, matches };
}

//----------------------------------------------------------------------------------------------------------------------
// Concatenate parent and child globs
//----------------------------------------------------------------------------------------------------------------------

function assembleGlob(parent: string | undefined, child: string) {
    const normalizedParent = parent ? normalizeGlob(parent) : "";
    const normalizedChild = normalizeGlob(child);
    if (normalizedParent) {
        const separator = normalizedChild.startsWith("/") ? "" : "/";
        return normalizeGlob([parent, separator, normalizedChild].join(""));
    } else {
        return normalizedChild;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Normalize a glob
//----------------------------------------------------------------------------------------------------------------------

function normalizeGlob(glob: string) {
    return glob.replace(/\/+/g, "/").replace(/\/$/, "");
}
