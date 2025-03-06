import picomatch from "picomatch";
import { Parameters } from "../../types/parameters.js";

//----------------------------------------------------------------------------------------------------------------------
// Normalize a glob and merge it with a parent (directory scope)
//----------------------------------------------------------------------------------------------------------------------

export function getEffectiveGlob(parentGlob: string | undefined, glob: string) {
    const childGlob = normalizeGlob(glob);
    if (parentGlob) {
        const separator = parentGlob.endsWith("/") || childGlob.startsWith("/") ? "" : "/";
        return `${parentGlob}${separator}${childGlob}`;
    } else {
        return childGlob;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Normalize a glob
//----------------------------------------------------------------------------------------------------------------------

function normalizeGlob(glob: string) {
    return glob.replace(/[/\\]+/g, "/").replace(/\/$/, "");
}

//----------------------------------------------------------------------------------------------------------------------
// Create a matcher
//----------------------------------------------------------------------------------------------------------------------

export function getGlobMatcher(parameters: Parameters, glob: string) {
    return picomatch(glob, { nocase: !parameters.caseSensitive });
}
