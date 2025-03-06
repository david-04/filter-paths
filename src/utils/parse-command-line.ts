import { exit } from "node:process";
import { Config } from "../types/config.js";
import { fail } from "./fail.js";

const APP_NAME = "filter-paths";
const VERSION = "0.0.0";

//----------------------------------------------------------------------------------------------------------------------
// Syntax help message
//----------------------------------------------------------------------------------------------------------------------

const USAGE = `

Filter file paths based on glob rules

Usage: ${APP_NAME} [OPTIONS] [--] [FILTER_RULE_FILES...]

[OPTIONS]

  -c | --case-sensitive ................ match case-sensitive (default: case-insensitive)
  -p | --print-rules ................... print the rules after before processing any input
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
    validateConfig(config);
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

function parseArgs(args: ReadonlyArray<string>): Config {
    const config = { caseSensitive: false, files: new Array<string>(), normalizePaths: true, printRules: false };
    let acceptOptions = true;

    for (const arg of args.map(arg => arg.trim()).filter(arg => arg)) {
        if (!acceptOptions) {
            config.files.push(arg);
        } else if (arg === "--") {
            acceptOptions = false;
        } else if (["-c", "--case-sensitive"].includes(arg)) {
            config.caseSensitive = true;
        } else if (["-p", "--print-rules"].includes(arg)) {
            config.printRules = true;
        } else if (arg.startsWith("-")) {
            fail(`Unknown option: ${arg}. Try ${APP_NAME} --help`);
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
    if (config.files.length === 0) {
        fail(`No filter rule files have been specified. Try ${APP_NAME} --help`);
    }
}
