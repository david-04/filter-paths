import { printRules } from "./rules/helpers/print-rules.js";
import { loadRuleset } from "./rules/load/load-ruleset.js";
import { Config } from "./types/config.js";
import { parseCommandLine } from "./utils/command-line-parser.js";
import { withErrorHandler } from "./utils/fail.js";

withErrorHandler(() => {
    const parameters = parseCommandLine(process.argv.slice(2));
    const config: Config = { ...parameters, ...loadRuleset(parameters) };
    if (config.printRules) {
        printRules(config.ruleset);
    }
});
