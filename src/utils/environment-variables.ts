import { fail } from "./fail.js";

//----------------------------------------------------------------------------------------------------------------------
// Regular expression to match environment variable placeholders
//----------------------------------------------------------------------------------------------------------------------

const REGEXP = /\${([^{}]+)}/;

const PLACEHOLDER_REGEXP = {
    "start-of-string-only": new RegExp(REGEXP.source, "g"),
    everywhere: new RegExp(`^${REGEXP.source}`),
} as const;

//----------------------------------------------------------------------------------------------------------------------
// Resolve environment variables
//----------------------------------------------------------------------------------------------------------------------

export function expandEnvironmentVariables(string: string, where: "start-of-string-only" | "everywhere") {
    return string.replace(PLACEHOLDER_REGEXP[where], placeholder => {
        const name = placeholder.replace(/^\$\{/, "").replace(/\}$/, "").trim();
        if (!name) {
            return fail(`Can't resolve path ${string} (invalid environment variable placeholder)`);
        } else {
            return (
                process.env[name] ??
                fail(`Can't resolve path ${string} (environment variable ${placeholder} is not set)`)
            );
        }
    });
}
