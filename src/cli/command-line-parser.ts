import { exit } from "node:process";
import { fail } from "../utils/fail.js";
import { Config } from "./config.js";

const FILTER_PATHS = "filter-paths";
const VERSION = "0.0.0";

//----------------------------------------------------------------------------------------------------------------------
// Syntax help message
//----------------------------------------------------------------------------------------------------------------------

const USAGE = `

${FILTER_PATHS} ${VERSION} - Filter file paths based on glob rules

Usage: ${FILTER_PATHS} [OPTIONS] [--] [FILTER_RULE_FILES...]

[OPTIONS]

  -c | --case-sensitive ................ match case-sensitive (default: case-insensitive)
  -h | --help .......................... display this help screen
  -v | --version ....................... display version information

`.trim();

//----------------------------------------------------------------------------------------------------------------------
// Parse all command line arguments
//----------------------------------------------------------------------------------------------------------------------

export function parseCommandLine(args: ReadonlyArray<string>): Config {
    handleHelpOption(args);
    handleVersionOption(args);
    const config = parseArgs(args);
    assertHasFilterRuleFiles(config);
    return config;
}

//----------------------------------------------------------------------------------------------------------------------
// Handle --help
//----------------------------------------------------------------------------------------------------------------------

function handleHelpOption(args: ReadonlyArray<string>) {
    if (args.some(argument => ["-h", "--help"].includes(argument))) {
        console.log(USAGE);
        exit(0);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Handle --version
//----------------------------------------------------------------------------------------------------------------------

function handleVersionOption(args: ReadonlyArray<string>) {
    if (args.some(argument => ["-v", "--version"].includes(argument))) {
        console.log(VERSION);
        exit(0);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Parse the remaining command line arguments
//----------------------------------------------------------------------------------------------------------------------

function parseArgs(args: ReadonlyArray<string>) {
    const config = { caseSensitive: false, filterRuleFiles: new Array<string>(), normalizePaths: true };
    let acceptOptions = true;

    for (const arg of args.map(arg => arg.trim()).filter(arg => arg)) {
        if (!acceptOptions) {
            config.filterRuleFiles.push(arg);
        } else if (arg === "--") {
            acceptOptions = false;
        } else if (["-c", "--case-sensitive"].includes(arg)) {
            config.caseSensitive = true;
        } else if (arg.startsWith("-")) {
            fail(`Unknown option: ${arg}. Try ${FILTER_PATHS} --help`);
        } else {
            config.filterRuleFiles.push(arg);
        }
    }

    return config;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that all specified files exist
//----------------------------------------------------------------------------------------------------------------------

function assertHasFilterRuleFiles(config: Config) {
    if (config.filterRuleFiles.length === 0) {
        fail(`No filter rule files have been specified. Try ${FILTER_PATHS} --help`);
    }
}
