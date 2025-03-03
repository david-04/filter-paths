import { exit } from "node:process";
import { parseCommandLine } from "./cli/command-line-parser.js";
import { DescriptiveError } from "./utils/fail.js";

try {
    const config = parseCommandLine(process.argv.slice(2));
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
