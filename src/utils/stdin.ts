import { createInterface, Interface } from "node:readline";
import { stderr } from "./stdout-and-stderr.js";

//----------------------------------------------------------------------------------------------------------------------
// Utility functions to access stdin
//----------------------------------------------------------------------------------------------------------------------

export namespace stdin {
    export const isTTY = process.stdin.isTTY;

    //
    //------------------------------------------------------------------------------------------------------------------
    // Open stdin for reading
    //------------------------------------------------------------------------------------------------------------------

    const getReadlineInterface = (() => {
        let _readlineInterface: Interface | undefined = undefined;
        return () => {
            const readlineInterface = _readlineInterface ?? createInterface({ input: process.stdin });
            _readlineInterface = readlineInterface;
            return readlineInterface;
        };
    })();

    //------------------------------------------------------------------------------------------------------------------
    // Invoke a callback for each line
    //------------------------------------------------------------------------------------------------------------------

    export async function forEachNonBlankLine(callback: (line: string, index: number) => void | Promise<unknown>) {
        let index = 0;
        for await (const line of getReadlineInterface()) {
            if (line.trim()) {
                await callback(line, index);
                index++;
            }
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Read one line of input
    //------------------------------------------------------------------------------------------------------------------

    export async function readLine(prompt?: string) {
        stderr.write(prompt ?? "");
        return new Promise<string>(resolve => getReadlineInterface().question("", resolve));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Read one line of input
    //------------------------------------------------------------------------------------------------------------------

    export async function prompt(question: string, previousAnswer?: string) {
        for (
            let answer = (await stdin.readLine(question)).trim();
            undefined !== answer;
            answer = (await stdin.readLine(question)).trim()
        ) {
            if (answer.length) {
                return answer;
            } else if (previousAnswer?.length) {
                stderr.print([stderr.cursorUpIfTTY, question, previousAnswer].join(""));
                return previousAnswer;
            }
            stderr.write(stderr.cursorUpIfTTY);
        }
        return "";
    }
}
