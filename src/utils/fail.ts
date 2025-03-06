import { exit } from "node:process";
import { Rule } from "../types/rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Error with a readable message (that does not require printing a stack trace)
//----------------------------------------------------------------------------------------------------------------------

export class DescriptiveError extends Error {}

//----------------------------------------------------------------------------------------------------------------------
// Throw a DescriptiveError
//----------------------------------------------------------------------------------------------------------------------

export function fail(source: Rule.Source, message: string): never;
export function fail(message: string, cause?: unknown): never;
export function fail(sourceOrMessage: Rule.Source | string, messageOrCause: unknown): never {
    if ("string" === typeof sourceOrMessage) {
        throw new DescriptiveError(sourceOrMessage, { cause: messageOrCause });
    } else if (sourceOrMessage.type === "file") {
        const { file, line, lineNumber } = sourceOrMessage;
        throw new DescriptiveError(`Invalid rule in ${file} at line ${lineNumber}:\n${line.trim()}\n${messageOrCause}`);
    } else {
        throw new DescriptiveError(`${messageOrCause}`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Run code with an error handler
//----------------------------------------------------------------------------------------------------------------------

export function withErrorHandler(callback: () => void) {
    try {
        callback();
    } catch (error) {
        if (error instanceof DescriptiveError) {
            const message = error.message.replace(/^[a-z]*error:\s*/i, "");
            console.error(`ERROR: ${message}`);
        } else {
            console.error(error);
        }
        exit(1);
    }
}
