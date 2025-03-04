//----------------------------------------------------------------------------------------------------------------------
// Error with a readable message (that does not require printing a stack trace)
//----------------------------------------------------------------------------------------------------------------------

import { RuleSource } from "../rules/types/rule-types.js";

export class DescriptiveError extends Error {}

//----------------------------------------------------------------------------------------------------------------------
// Throw a DescriptiveError
//----------------------------------------------------------------------------------------------------------------------

export function fail(source: Pick<RuleSource, "file" | "line" | "lineNumber">, message: string): never;
export function fail(message: string, cause?: unknown): never;
export function fail(
    sourceOrMessage: Pick<RuleSource, "file" | "line" | "lineNumber"> | string,
    messageOrCause: unknown
): never {
    const message = "string" === typeof sourceOrMessage ? sourceOrMessage : `${messageOrCause}`;
    if ("string" === typeof sourceOrMessage) {
        throw new DescriptiveError(message, { cause: messageOrCause });
    } else {
        const { file, line, lineNumber } = sourceOrMessage;
        throw new DescriptiveError(`Invalid rule in ${file} at line ${lineNumber}:\n${line}\n${messageOrCause}`);
    }
}
