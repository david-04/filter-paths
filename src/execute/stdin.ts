import { createInterface } from "node:readline";
import { isatty } from "node:tty";

//----------------------------------------------------------------------------------------------------------------------
// Utility functions to access stdin
//----------------------------------------------------------------------------------------------------------------------

export namespace stdin {
    //
    //------------------------------------------------------------------------------------------------------------------
    // Invoke a callback for each line
    //------------------------------------------------------------------------------------------------------------------

    export async function forEachNonBlankLine(callback: (line: string, index: number) => void | Promise<unknown>) {
        let index = 0;
        for await (const line of createInterface({ input: process.stdin })) {
            if (line.trim()) {
                index++;
                await callback(line, index);
            }
        }
    }

    export const isTTY = isatty(0);
}
