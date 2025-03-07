import { isAbsolute, join, normalize, resolve } from "node:path";
import { Rule } from "../../types/rules.js";
import { expandEnvironmentVariables } from "../../utils/environment-variables.js";

//----------------------------------------------------------------------------------------------------------------------
// Create a file descriptor
//----------------------------------------------------------------------------------------------------------------------

export function createFileDescriptor(parent: Rule.Fragment.File | undefined, file: string): Rule.Fragment.File {
    const original = file.trim();
    const resolved = normalizePath(expandEnvironmentVariables(original, "everywhere"));
    if (isAbsolute(resolved) || !parent) {
        const absolute = normalizePath(resolve(resolved));
        return { absolute, equals: createEqualsFunction(absolute), original, resolved };
    } else {
        const concatenated = normalizePath(join(parent.resolved, "..", resolved));
        const absolute = normalizePath(resolve(concatenated));
        return { absolute, equals: createEqualsFunction(absolute), original, resolved: concatenated };
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Normalize a path
//----------------------------------------------------------------------------------------------------------------------

function normalizePath(path: string) {
    return normalize(path).trim().replaceAll("\\", "/");
}

//----------------------------------------------------------------------------------------------------------------------
// Create the equals function
//----------------------------------------------------------------------------------------------------------------------

function createEqualsFunction(absolutePath: string) {
    return (fileOrRuleSource: Rule.Fragment.File | Rule.Source.File) => {
        const file = "type" in fileOrRuleSource ? fileOrRuleSource.file : fileOrRuleSource;
        return file.absolute === absolutePath;
    };
}
