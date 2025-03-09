import { createInterface } from "node:readline";
import { isatty } from "node:tty";

//----------------------------------------------------------------------------------------------------------------------
// Utility functions to access stdin
//----------------------------------------------------------------------------------------------------------------------

export namespace stdin {
    const getReadlineInterface = (() => {
        const readlineInterface = createInterface({ input: process.stdin });
        return () => readlineInterface;
    })();

    export const isTTY = isatty(0);

    //
    //------------------------------------------------------------------------------------------------------------------
    // Invoke a callback for each line
    //------------------------------------------------------------------------------------------------------------------

    export async function forEachNonBlankLine(callback: (line: string, index: number) => void | Promise<unknown>) {
        let index = 0;
        for await (const line of getReadlineInterface()) {
            if (line.trim()) {
                index++;
                await callback(line, index);
            }
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Read one line of input
    //------------------------------------------------------------------------------------------------------------------

    export async function readLine(prompt?: string) {
        process.stderr.write(prompt ?? "");
        return new Promise<string>(resolve => getReadlineInterface().question("", resolve));
    }
}
