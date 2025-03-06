import { printRules } from "./rules/helpers/print-rules.js";
import { loadRuleset } from "./rules/load/load-ruleset.js";
import { withErrorHandler } from "./utils/fail.js";
import { parseCommandLine } from "./utils/parse-command-line.js";

withErrorHandler(() => {
    const config = parseCommandLine(process.argv.slice(2));
    const ruleset = loadRuleset(config);
    if (config.printRules) {
        printRules(ruleset);
    }
});
