import { existsSync, statSync } from "node:fs";
import { Config } from "../../types/config.js";
import { Rule } from "../../types/rules.js";
import { fail } from "../../utils/fail.js";
import { isArgv } from "../helpers/rule-type-utils.js";

//----------------------------------------------------------------------------------------------------------------------
// Verify that the file exists
//----------------------------------------------------------------------------------------------------------------------

export function assertFileExists(config: Config, source: Rule.Source, { resolved }: Rule.Fragment.File) {
    const includedIn = isArgv(source) ? "" : ` (referenced in ${source.file.resolved} at line ${source.lineNumber})`;
    if (config.testFixtures) {
        if (!config.testFixtures.has(resolved)) {
            fail(`File ${resolved}${includedIn} does not exist`);
        }
    } else if (!existsSync(resolved)) {
        fail(`File ${resolved}${includedIn} does not exist`);
    } else if (!statSync(resolved).isFile()) {
        fail(`${resolved}${includedIn} is not a file`);
    }
}
