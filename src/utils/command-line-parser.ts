import { exit } from "node:process";
import { Parameters } from "../types/parameters.js";
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
  -h | --help .......................... display this help screen
  -v | --version ....................... display version information

`.trim();

//----------------------------------------------------------------------------------------------------------------------
// Parse all command line arguments
//----------------------------------------------------------------------------------------------------------------------

export function parseCommandLine(args: ReadonlyArray<string>): Parameters {
    handleHelpOption(args);
    handleVersionOption(args);
    const parameters = parseArgs(args);
    assertHasFilterRuleFiles(parameters.files);
    return parameters;
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

function parseArgs(args: ReadonlyArray<string>): Parameters {
    const parameters = { caseSensitive: false, files: new Array<string>(), normalizePaths: true };
    let acceptOptions = true;

    for (const arg of args.map(arg => arg.trim()).filter(arg => arg)) {
        if (!acceptOptions) {
            parameters.files.push(arg);
        } else if (arg === "--") {
            acceptOptions = false;
        } else if (["-c", "--case-sensitive"].includes(arg)) {
            parameters.caseSensitive = true;
        } else if (arg.startsWith("-")) {
            fail(`Unknown option: ${arg}. Try ${APP_NAME} --help`);
        } else {
            parameters.files.push(arg);
        }
    }

    return parameters;
}

//----------------------------------------------------------------------------------------------------------------------
// Verify that all specified files exist
//----------------------------------------------------------------------------------------------------------------------

function assertHasFilterRuleFiles(files: ReadonlyArray<string>) {
    if (files.length === 0) {
        fail(`No filter rule files have been specified. Try ${APP_NAME} --help`);
    }
}
