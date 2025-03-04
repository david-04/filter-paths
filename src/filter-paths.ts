import { exit } from "node:process";
import { parseCommandLine } from "./cli/parse-command-line.js";
import { loadRuleset } from "./rules/load/load-ruleset.js";
import { Config } from "./types/config.js";
import { DescriptiveError } from "./utils/fail.js";

try {
    const parameters = parseCommandLine(process.argv.slice(2));
    const config: Config = { ...parameters, ruleset: loadRuleset(parameters) };
    console.log(config);
} catch (error) {
    if (error instanceof DescriptiveError) {
        const message = error.message.replace(/^[a-z]*error:\s*/i, "");
        console.error(`ERROR: ${message}`);
    } else {
        console.error(error);
    }
    exit(1);
}
