import { exit } from "node:process";
import { isFile } from "../rules/helpers/rule-type-utils.js";
import { Rule } from "../types/rules.js";

const MAX_MESSAGE_LENGTH = 120;

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
    } else if (isFile(sourceOrMessage)) {
        const { file, line, lineNumber } = sourceOrMessage;
        const intro = `Invalid rule in ${file.resolved} at line ${lineNumber}:`;
        const quote = line.trim();
        const outro = `${messageOrCause}`;
        const maxSeparatorWidth = Math.max(intro.length, quote.length, outro.length);
        const terminalWidth = isNaN(process.stdout.columns) ? MAX_MESSAGE_LENGTH : process.stdout.columns;
        const separatorWidth = Math.min(maxSeparatorWidth, Math.max(MAX_MESSAGE_LENGTH, terminalWidth));
        const separator = new Array<string>(separatorWidth).fill("-").join("");
        throw new DescriptiveError([intro, "", separator, quote, separator, "", outro].join("\n"));
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
