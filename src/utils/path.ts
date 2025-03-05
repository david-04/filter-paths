import { fail } from "node:assert";
import { isAbsolute, join, normalize, resolve } from "node:path";

//----------------------------------------------------------------------------------------------------------------------
// Resolve a path stand-alone or relative to a parent path
//----------------------------------------------------------------------------------------------------------------------

export function resolvePath(path: string): string;
export function resolvePath(parent: string, path: string): string;
export function resolvePath(parentPath: string, childPath?: string): string {
    if (childPath === undefined) {
        return normalizePath(expandEnvironmentVariables(parentPath));
    } else {
        const path = normalizePath(expandEnvironmentVariables(childPath));
        return isAbsolute(path)
            ? path
            : normalizePath(join(normalizePath(expandEnvironmentVariables(parentPath)), path));
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Normalize a path
//----------------------------------------------------------------------------------------------------------------------

export function normalizePath(path: string) {
    return normalize(path).trim().replaceAll("\\", "/");
}

//----------------------------------------------------------------------------------------------------------------------
// Resolve environment variables
//----------------------------------------------------------------------------------------------------------------------

function expandEnvironmentVariables(path: string) {
    return path.replace(/\${([^}]+)}/g, placeholder => {
        const name = placeholder.replace(/^\$\{/, "").replace(/\}$/, "").trim();
        if (!name) {
            return fail(`Can't resolve path ${path} (invalid environment variable placeholder)`);
        } else {
            return (
                process.env[name] ?? fail(`Can't resolve path ${path} (environment variable ${placeholder} is not set)`)
            );
        }
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Check if two paths equal
//----------------------------------------------------------------------------------------------------------------------

export function pathsAreEqual(path1: string, path2: string) {
    return resolve(resolvePath(path1)) === resolve(resolvePath(path2));
}
