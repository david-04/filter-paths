import { applyRuleset } from "../rules/apply/apply-rules.js";
import { printRuleset } from "../rules/helpers/print-ruleset.js";
import { Config } from "../types/config.js";
import { Ruleset } from "../types/rules.js";
import { stdin } from "../utils/stdin.js";
import { stdout } from "../utils/stdout-and-stderr.js";
import { runDebug } from "./run-debug.js";

//----------------------------------------------------------------------------------------------------------------------
// Run the application
//----------------------------------------------------------------------------------------------------------------------

export async function runApplication(config: Config, ruleset: Ruleset) {
    if (config.printRules) {
        printRuleset(ruleset);
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
