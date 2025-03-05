import { printRules } from "./rules/helpers/print-rules.js";
import { loadRuleset } from "./rules/load/load-ruleset.js";
import { parseCommandLine } from "./utils/command-line-parser.js";
import { withErrorHandler } from "./utils/fail.js";

withErrorHandler(() => {
    const parameters = parseCommandLine(process.argv.slice(2));
    const ruleset = loadRuleset(parameters);
    if (parameters.printRules) {
        printRules(ruleset);
    }
});
