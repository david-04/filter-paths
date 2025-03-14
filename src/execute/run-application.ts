import { applyRuleset } from "../rules/apply/apply-rules.js";
import { stringifyRuleset } from "../rules/stringify/stringify-ruleset.js";
import { Config } from "../types/config.js";
import { Ruleset } from "../types/rules.js";
import { stdin } from "../utils/stdin.js";
import { stdout } from "../utils/stdout.js";
import { runDebug } from "./run-debug.js";

//----------------------------------------------------------------------------------------------------------------------
// Run the application
//----------------------------------------------------------------------------------------------------------------------

export async function runApplication(config: Config, ruleset: Ruleset) {
    if (config.printRules) {
        stdout.print(stringifyRuleset(ruleset, stdout.ansi));
    } else if (config.debug) {
        await runDebug(config, ruleset);
    } else {
        await stdin.forEachNonBlankLine(line => {
            if (applyRuleset.withoutAuditTrail(ruleset, line).includePath) {
                stdout.print(line);
            }
        });
    }
}
