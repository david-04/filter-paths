import { existsSync, statSync } from "node:fs";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { comesFromFile } from "../helpers/rule-type-guards.js";

//----------------------------------------------------------------------------------------------------------------------
// Verify that the file exists
//----------------------------------------------------------------------------------------------------------------------

export function assertFileExists(source: Rule.Source, { resolved }: Rule.Fragment.File) {
    const includedIn = comesFromFile(source)
        ? ` (included in ${source.file.resolved} at line ${source.lineNumber})`
        : "";
    if (!existsSync(resolved)) {
        fail(`File ${resolved}${includedIn} does not exist`);
    } else if (!statSync(resolved).isFile()) {
        fail(`${resolved}${includedIn} is not a file`);
    }
}
