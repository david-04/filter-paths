import { exit } from "node:process";
import { Config } from "../types/config.js";
import { fail } from "./fail.js";
import { MANUAL } from "./manual.js";
import { VERSION } from "./version.js";

const APP_NAME = "filter-paths";

//----------------------------------------------------------------------------------------------------------------------
// Syntax help message
//----------------------------------------------------------------------------------------------------------------------

const USAGE = `

Filter paths based on glob rules

Usage: ${APP_NAME} [OPTIONS] [--] [FILTER_RULE_FILES...]

[OPTIONS]

  -c | --case-sensitive ....... match globs case-sensitive
  -d | --debug ................ print which rules were evaluated for each path
  -p | --print-rules .......... print the filter rules
  -h | --help ................. display this help screen
  -m | --manual ............... display the user manual
  -n | --normalize-output ..... print matched paths in a normalized format
                                (this option only impacts the output and does
                                not affect the matching; internally, all paths
                                are normalized before any globs are evaluated)
  -t | --test ................. alias for --debug
  -v | --version .............. display the version number of ${APP_NAME}

Use option --manual to display the user manual and learn about the filter rule
file syntax, or view the manual online:

https://github.com/david-04/filter-paths
https://www.npmjs.com/package/filter-paths

`.trim();

//----------------------------------------------------------------------------------------------------------------------
// Parse all command line arguments
//----------------------------------------------------------------------------------------------------------------------

export function parseCommandLine(args: ReadonlyArray<string>): Config {
    handleHelpAndVersionOptions(args);
    const config = parseArgs(args);
    validateConfig(config);
    return config;
}

//----------------------------------------------------------------------------------------------------------------------
// Handle --help
//----------------------------------------------------------------------------------------------------------------------

function handleHelpAndVersionOptions(args: ReadonlyArray<string>) {
    const has = (...options: ReadonlyArray<string>) => options.some(option => args.includes(option));
    const hasVersion = has("-v", "--version");
    const hasHelp = has("-h", "--help");
    const hasManual = has("-m", "--manual");
    const output = [
        ...(hasVersion ? [VERSION] : []),
        ...(hasHelp ? [USAGE] : []),
        ...(hasManual ? [MANUAL.join("\n")] : []),
    ].join("\n\n");
    if (output) {
        console.log(output);
        exit(0);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Parse the remaining command line arguments
//----------------------------------------------------------------------------------------------------------------------

function parseArgs(args: ReadonlyArray<string>): Config {
    const config = {
        caseSensitive: false,
        debug: false,
        files: new Array<string>(),
        normalizeOutput: false,
        printRules: false,
        testFixtures: undefined,
    };
    let acceptOptions = true;

    for (const arg of args.map(arg => arg.trim()).filter(arg => arg)) {
        if (!acceptOptions) {
            config.files.push(arg);
        } else if (arg === "--") {
            acceptOptions = false;
        } else if (["-c", "--case-sensitive"].includes(arg)) {
            config.caseSensitive = true;
        } else if (["-d", "--debug"].includes(arg)) {
            config.debug = true;
        } else if (["-n", "--normalize-output"].includes(arg)) {
            config.normalizeOutput = true;
        } else if (["-p", "--print-rules"].includes(arg)) {
            config.printRules = true;
        } else if (arg.startsWith("-")) {
            fail(`Unknown command-line option: ${arg}. Try ${APP_NAME} --help`);
        } else {
            config.files.push(arg);
        }
    }

    return config;
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the configuration
//----------------------------------------------------------------------------------------------------------------------

function validateConfig(config: Config) {
    if (config.files.length === 0 && !config.debug) {
        fail(`Invalid arguments. No filter rules files have been specified. Try ${APP_NAME} --help`);
    }
}
