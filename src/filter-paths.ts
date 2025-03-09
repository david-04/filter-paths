import { runApplication } from "./execute/run-application.js";
import { loadRuleset } from "./rules/load/load-ruleset.js";
import { withErrorHandler } from "./utils/fail.js";
import { parseCommandLine } from "./utils/parse-command-line.js";

//----------------------------------------------------------------------------------------------------------------------
// Entry point
//----------------------------------------------------------------------------------------------------------------------

await withErrorHandler(async () => {
    const config = parseCommandLine(process.argv.slice(2));
    const ruleset = loadRuleset(config);
    await runApplication(config, ruleset);
});
