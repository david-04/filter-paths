import { parseCommandLine } from "./cli/parse-command-line.js";
import { loadRuleset } from "./rules/load/load-ruleset.js";
import { Config } from "./types/config.js";
import { withErrorHandler } from "./utils/fail.js";

withErrorHandler(() => {
    const parameters = parseCommandLine(process.argv.slice(2));
    const ruleset = loadRuleset(parameters);
    const config: Config = { ...parameters, ruleset };
    console.log(config);
});
