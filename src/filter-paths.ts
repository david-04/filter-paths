import { exit } from "node:process";
import { Config } from "./cli/config.js";
import { parseCommandLineParameters } from "./cli/parse-command-line-parameters.js";
import { loadRuleset } from "./filter-rules/load-ruleset.js";
import { DescriptiveError } from "./utils/fail.js";

try {
    const commandLineParameters = parseCommandLineParameters(process.argv.slice(2));
    const config: Config = { ...commandLineParameters, ruleset: loadRuleset(commandLineParameters) };
    console.log(config);
    console.log(config.ruleset);
} catch (error) {
    if (error instanceof DescriptiveError) {
        const message = error.message.replace(/^[a-z]*error:\s*/i, "");
        console.error(`ERROR: ${message}`);
    } else {
        console.error(error);
    }
    exit(1);
}
