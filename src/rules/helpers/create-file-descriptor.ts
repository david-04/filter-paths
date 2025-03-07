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
        return assembleFileDescriptor({ original, resolved });
    } else {
        return assembleFileDescriptor({ original, resolved: normalizePath(join(parent.resolved, "..", resolved)) });
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Normalize a path
//----------------------------------------------------------------------------------------------------------------------

function normalizePath(path: string) {
    return normalize(path).trim().replaceAll("\\", "/");
}

//----------------------------------------------------------------------------------------------------------------------
// Assemble the file descriptor
//----------------------------------------------------------------------------------------------------------------------

function assembleFileDescriptor({ original, resolved }: Record<"original" | "resolved", string>): Rule.Fragment.File {
    const absolute = normalizePath(resolve(resolved));
    const equals = (fileOrRuleSource: Rule.Fragment.File | Rule.Source.File) => {
        const file = "type" in fileOrRuleSource ? fileOrRuleSource.file : fileOrRuleSource;
        return file.absolute === absolute;
    };
    return { absolute, equals, original, resolved };
}
